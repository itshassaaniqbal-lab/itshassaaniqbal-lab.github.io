"""Resize embedded GLB textures without changing meshes, rigs, or animations.

The source model contains texture color profiles that libvips cannot process.
This small build utility uses Pillow instead and rebuilds the GLB bufferViews
with four-byte alignment required by the glTF specification.
"""

from __future__ import annotations

import argparse
import io
import json
import mmap
import shutil
import struct
import tempfile
from pathlib import Path
from typing import Any

from PIL import Image

GLB_MAGIC = 0x46546C67
JSON_CHUNK = 0x4E4F534A
BIN_CHUNK = 0x004E4942


def align_four(value: int) -> int:
    return (value + 3) & ~3


def encode_texture(data: bytes, mime_type: str, max_size: int) -> bytes:
    with Image.open(io.BytesIO(data)) as image:
        image.thumbnail((max_size, max_size), Image.Resampling.LANCZOS)
        output = io.BytesIO()

        if mime_type == "image/jpeg":
            image.convert("RGB").save(
                output,
                format="JPEG",
                quality=84,
                optimize=True,
                progressive=True,
            )
        else:
            if image.mode not in {"RGB", "RGBA", "L", "LA"}:
                image = image.convert("RGBA")
            image.save(output, format="PNG", optimize=True, compress_level=9)

        return output.getvalue()


def parse_glb(mm: mmap.mmap) -> tuple[dict[str, Any], int, int]:
    magic, version, _ = struct.unpack_from("<III", mm, 0)
    if magic != GLB_MAGIC or version != 2:
        raise ValueError("Input is not a glTF 2.0 binary file")

    cursor = 12
    json_document: dict[str, Any] | None = None
    bin_offset = 0
    bin_length = 0

    while cursor < len(mm):
        chunk_length, chunk_type = struct.unpack_from("<II", mm, cursor)
        chunk_start = cursor + 8
        if chunk_type == JSON_CHUNK:
            json_document = json.loads(mm[chunk_start : chunk_start + chunk_length])
        elif chunk_type == BIN_CHUNK:
            bin_offset = chunk_start
            bin_length = chunk_length
        cursor = chunk_start + chunk_length

    if json_document is None or bin_length == 0:
        raise ValueError("GLB must contain JSON and BIN chunks")

    return json_document, bin_offset, bin_length


def optimize_textures(source: Path, destination: Path, max_size: int) -> None:
    destination.parent.mkdir(parents=True, exist_ok=True)

    with source.open("rb") as source_file, mmap.mmap(
        source_file.fileno(), length=0, access=mmap.ACCESS_READ
    ) as mm:
        document, bin_offset, _ = parse_glb(mm)
        buffer_views = document.get("bufferViews", [])
        images = document.get("images", [])
        image_by_view = {
            image["bufferView"]: image
            for image in images
            if "bufferView" in image and image.get("mimeType") in {"image/png", "image/jpeg"}
        }

        with tempfile.NamedTemporaryFile(delete=False) as temp_bin:
            temp_path = Path(temp_bin.name)
            for index, buffer_view in enumerate(buffer_views):
                original_offset = int(buffer_view.get("byteOffset", 0))
                original_length = int(buffer_view["byteLength"])
                start = bin_offset + original_offset
                end = start + original_length
                new_offset = temp_bin.tell()

                image = image_by_view.get(index)
                if image is not None:
                    encoded = encode_texture(
                        mm[start:end],
                        str(image["mimeType"]),
                        max_size,
                    )
                    temp_bin.write(encoded)
                    new_length = len(encoded)
                    print(f"texture {index + 1}/{len(buffer_views)} -> {new_length / 1_048_576:.2f} MB")
                else:
                    temp_bin.write(memoryview(mm)[start:end])
                    new_length = original_length

                buffer_view["byteOffset"] = new_offset
                buffer_view["byteLength"] = new_length
                padding = align_four(temp_bin.tell()) - temp_bin.tell()
                if padding:
                    temp_bin.write(b"\x00" * padding)

            bin_length = temp_bin.tell()

        try:
            document["buffers"][0]["byteLength"] = bin_length
            json_bytes = json.dumps(document, separators=(",", ":")).encode("utf-8")
            json_padding = align_four(len(json_bytes)) - len(json_bytes)
            json_bytes += b" " * json_padding
            bin_padding = align_four(bin_length) - bin_length
            total_length = 12 + 8 + len(json_bytes) + 8 + bin_length + bin_padding

            with destination.open("wb") as output, temp_path.open("rb") as temp_input:
                output.write(struct.pack("<III", GLB_MAGIC, 2, total_length))
                output.write(struct.pack("<II", len(json_bytes), JSON_CHUNK))
                output.write(json_bytes)
                output.write(struct.pack("<II", bin_length + bin_padding, BIN_CHUNK))
                shutil.copyfileobj(temp_input, output, length=8 * 1024 * 1024)
                if bin_padding:
                    output.write(b"\x00" * bin_padding)
        finally:
            temp_path.unlink(missing_ok=True)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("source", type=Path)
    parser.add_argument("destination", type=Path)
    parser.add_argument("--max-size", type=int, default=1024)
    args = parser.parse_args()
    optimize_textures(args.source, args.destination, args.max_size)


if __name__ == "__main__":
    main()
