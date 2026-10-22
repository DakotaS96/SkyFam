"""Convert HEIC/HEIF images into browser-compatible cached JPEGs."""

import hashlib
import os
import subprocess
import tempfile
from pathlib import Path

import cv2

PHOTO_DIR = Path(__file__).resolve().parent / "static" / "photos"
CACHE_DIR = PHOTO_DIR / ".heic-cache"


def ensure_heic_preview(filename):
    if Path(filename).name != filename:
        raise ValueError("Invalid HEIC filename")

    if Path(filename).suffix.lower() not in (".heic", ".heif"):
        raise ValueError("Unsupported HEIC filename")

    source = PHOTO_DIR / filename
    stat = source.stat()

    if not source.is_file():
        raise ValueError("HEIC source is not a file")

    identity = f"{filename}:{stat.st_size}:{stat.st_mtime_ns}"
    digest = hashlib.sha256(identity.encode()).hexdigest()[:24]
    result_name = f"heic-{digest}.jpg"
    relative = f".heic-cache/{result_name}"
    output = CACHE_DIR / result_name

    if output.is_file() and output.stat().st_size > 0:
        return relative

    CACHE_DIR.mkdir(parents=True, exist_ok=True)
    fd, temporary = tempfile.mkstemp(
        prefix="pending-", suffix=".jpg", dir=CACHE_DIR
    )
    os.close(fd)

    try:
        subprocess.run(
            ["heif-convert", "--quiet", "-q", "92",
             str(source), temporary],
            check=True, timeout=120,
            capture_output=True, text=True
        )

        # HEIF conversion can rotate pixels while retaining the old
        # EXIF orientation. Normalize the resulting JPEG metadata.
        subprocess.run(
            ["exiftool", "-overwrite_original", "-n",
             "-Orientation=1", temporary],
            check=True, timeout=30,
            capture_output=True, text=True
        )

        image = cv2.imread(temporary)
        if image is None or image.size == 0:
            raise RuntimeError("Converted JPEG could not be decoded")

        os.replace(temporary, output)
    finally:
        if os.path.exists(temporary):
            os.unlink(temporary)

    return relative
