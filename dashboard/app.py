from flask import Flask, render_template, send_from_directory, request, jsonify
from werkzeug.utils import secure_filename
import os
import hmac
import subprocess
import requests
from youtube_config import LIVE_CHANNEL_ID
import json
import cv2
import time
from urllib.parse import urlparse, parse_qs

app = Flask(__name__)


@app.context_processor
def inject_skyfam_public_urls():
    return {
        "skyfam_dashboard_url": os.environ.get(
            "SKYFAM_DASHBOARD_URL", ""
        ).strip(),
        "skyfam_chat_url": os.environ.get(
            "SKYFAM_CHAT_URL", ""
        ).strip(),
        "skyfam_radio_url": os.environ.get(
            "SKYFAM_RADIO_URL", ""
        ).strip(),
    }



YOUTUBE_ENV_FILE = "/etc/skyfam-youtube.env"
ADMIN_ENV_FILE = "/etc/skyfam-admin.env"

FEATURED_VIDEO_FILE = (
    "/opt/dashboard/static/featured_video.json"
)


def read_env_value(path, name):

    try:

        with open(
            path,
            "r",
            encoding="utf-8"
        ) as file:

            for line in file:

                line = line.strip()

                if (
                    not line
                    or line.startswith("#")
                    or "=" not in line
                ):
                    continue

                key, value = line.split("=", 1)

                if key.strip() != name:
                    continue

                value = value.strip()

                if (
                    len(value) >= 2
                    and value[0] == value[-1]
                    and value[0] in ("'", '"')
                ):
                    value = value[1:-1]

                return value

    except FileNotFoundError:
        pass

    return ""


def valid_admin_password(password):

    expected = read_env_value(
        ADMIN_ENV_FILE,
        "SKYFAM_ADMIN_PASSWORD"
    )

    if not expected:
        return False

    return hmac.compare_digest(
        str(password or ""),
        expected
    )


def test_youtube_key(api_key):

    api_key = str(
        api_key or ""
    ).strip()

    if not api_key:

        return (
            False,
            "Enter a YouTube Data API key."
        )

    if (
        "\n" in api_key
        or "\r" in api_key
        or len(api_key) > 250
    ):

        return (
            False,
            "Invalid API key format."
        )

    url = (
        "https://www.googleapis.com/"
        "youtube/v3/search"
    )

    params = {
        "part": "snippet",
        "channelId": LIVE_CHANNEL_ID,
        "eventType": "live",
        "type": "video",
        "key": api_key
    }

    try:

        response = requests.get(
            url,
            params=params,
            timeout=10
        )

    except requests.RequestException:

        return (
            False,
            "Unable to contact the YouTube API."
        )

    if response.ok:

        return (
            True,
            "YouTube API key works."
        )

    message = "YouTube rejected this API key."

    try:

        data = response.json()

        google_message = (
            data.get("error", {})
                .get("message", "")
                .strip()
        )

        if google_message:
            message = google_message

    except Exception:
        pass

    return False, message


PHOTO_DIR = "/opt/dashboard/static/photos"

FACE_CACHE_FILE = "/opt/dashboard/face_positions.json"

FACE_CASCADE_FILE = (
    "/usr/share/opencv4/haarcascades/"
    "haarcascade_frontalface_default.xml"
)

face_cascade = cv2.CascadeClassifier(FACE_CASCADE_FILE)


def load_face_cache():
    try:
        with open(FACE_CACHE_FILE, "r", encoding="utf-8") as file:
            data = json.load(file)

        if isinstance(data, dict):
            return data

    except (FileNotFoundError, json.JSONDecodeError, OSError):
        pass

    return {}


def save_face_cache(cache):
    temporary = FACE_CACHE_FILE + ".tmp"

    with open(temporary, "w", encoding="utf-8") as file:
        json.dump(
            cache,
            file,
            indent=2,
            sort_keys=True
        )

    os.replace(temporary, FACE_CACHE_FILE)


def detect_portrait_face_position(filename):
    image_path = os.path.join(
        PHOTO_DIR,
        filename
    )

    # SVG placeholders are not raster images.
    if filename.lower().endswith(".svg"):
        return "center top"

    image = cv2.imread(image_path)

    if image is None:
        return "center top"

    height, width = image.shape[:2]

    # Landscape photos remain unchanged.
    if height <= width:
        return "center top"

    gray = cv2.cvtColor(
        image,
        cv2.COLOR_BGR2GRAY
    )

    faces = face_cascade.detectMultiScale(
        gray,
        scaleFactor=1.1,
        minNeighbors=5,
        minSize=(
            max(30, width // 15),
            max(30, height // 15)
        )
    )

    if len(faces) == 0:
        return "center top"

    left = min(
        int(x)
        for x, y, w, h in faces
    )

    right = max(
        int(x + w)
        for x, y, w, h in faces
    )

    top = min(
        int(y)
        for x, y, w, h in faces
    )

    bottom = max(
        int(y + h)
        for x, y, w, h in faces
    )

    center_x = (left + right) / 2
    center_y = (top + bottom) / 2

    percent_x = (center_x / width) * 100
    percent_y = (center_y / height) * 100

    percent_x = max(
        15,
        min(85, percent_x)
    )

    percent_y = max(
        20,
        min(65, percent_y)
    )

    return f"{percent_x:.1f}% {percent_y:.1f}%"


def get_face_positions(filenames):
    cache = load_face_cache()
    changed = False

    for filename in filenames:
        if filename in cache:
            continue

        cache[filename] = detect_portrait_face_position(
            filename
        )

        changed = True

    if changed:
        save_face_cache(cache)

    return {
        f"/static/photos/{filename}": cache.get(
            filename,
            "center top"
        )
        for filename in filenames
    }


@app.route("/")
def index():

    photos = sorted(
        os.listdir(PHOTO_DIR),
        key=lambda x: os.path.getmtime(
            os.path.join(
                PHOTO_DIR,
                x
            )
        ),
        reverse=True
    )

    placeholder_files = {
        "skyfam-welcome.svg",
        "skyfam-weather.svg",
        "add-your-photos.svg",
        "skyfam-family-chat.svg",
        "skyfam-games.svg"
    }

    all_photo_filenames = [
        p
        for p in photos
        if p.lower().endswith(
            (
                '.jpg',
                '.jpeg',
                '.png',
                '.svg',
                '.webp',
                '.gif'
            )
        )
    ]

    real_photos = [
        p
        for p in all_photo_filenames
        if p not in placeholder_files
    ]

    if real_photos:
        photo_filenames = real_photos
    else:
        photo_filenames = [
            p
            for p in all_photo_filenames
            if p in placeholder_files
        ]

    photos = [
        f"/static/photos/{p}"
        for p in photo_filenames
    ]

    face_positions = get_face_positions(
        photo_filenames
    )

    return render_template(
        "index.html",
        photos=photos,
        face_positions=face_positions
    )

@app.route("/games/<path:filename>")
def games(filename):
    return send_from_directory(
        "/opt/dashboard/games",
        filename
    )

@app.route("/api/upload-photo", methods=["POST"])
def upload_photo():

    if "photo" not in request.files:
        return jsonify({
            "success": False,
            "error": "No file"
        }), 400

    file = request.files["photo"]

    if file.filename == "":
        return jsonify({
            "success": False,
            "error": "No filename"
        }), 400

    allowed = (
        ".jpg",
        ".jpeg",
        ".png",
        ".webp",
        ".gif"
    )

    if not file.filename.lower().endswith(
        allowed
    ):
        return jsonify({
            "success": False,
            "error": "Invalid file type"
        }), 400

    filename = secure_filename(
        file.filename
    )

    file.save(
        os.path.join(
            PHOTO_DIR,
            filename
        )
    )

    # Analyze the newly uploaded photo immediately so
    # the dashboard never has to wait for a later page load.
    face_position = detect_portrait_face_position(
        filename
    )

    cache = load_face_cache()
    cache[filename] = face_position
    save_face_cache(cache)

    photo_url = f"/static/photos/{filename}"

    return jsonify({
        "success": True,
        "filename": filename,
        "url": photo_url,
        "face_position": face_position
    })


def extract_youtube_video_id(value):

    value = str(
        value or ""
    ).strip()

    if not value:
        return ""

    try:

        parsed = urlparse(value)

        hostname = (
            parsed.hostname or ""
        ).lower()

        video_id = ""

        if hostname in (
            "youtu.be",
            "www.youtu.be"
        ):

            video_id = (
                parsed.path
                .strip("/")
                .split("/")[0]
            )

        elif hostname in (
            "youtube.com",
            "www.youtube.com",
            "m.youtube.com"
        ):

            if parsed.path == "/watch":

                video_id = (
                    parse_qs(
                        parsed.query
                    )
                    .get("v", [""])[0]
                )

            elif parsed.path.startswith(
                "/live/"
            ):

                video_id = (
                    parsed.path
                    .split("/live/", 1)[1]
                    .split("/")[0]
                )

            elif parsed.path.startswith(
                "/embed/"
            ):

                video_id = (
                    parsed.path
                    .split("/embed/", 1)[1]
                    .split("/")[0]
                )

        if (
            len(video_id) == 11
            and all(
                char.isalnum()
                or char in "-_"
                for char in video_id
            )
        ):
            return video_id

    except Exception:
        pass

    return ""


def read_featured_video():

    try:

        with open(
            FEATURED_VIDEO_FILE,
            "r",
            encoding="utf-8"
        ) as file:

            data = json.load(file)

            if isinstance(data, dict):

                if (
                    data.get("enabled")
                    and data.get("startedAt")
                ):

                    try:

                        age = (
                            time.time()
                            - float(
                                data.get("startedAt")
                            )
                        )

                        if age >= 43200:

                            data = {
                                "enabled": False,
                                "title": "",
                                "videoId": "",
                                "startedAt": None
                            }

                            write_featured_video(
                                data
                            )

                    except (
                        TypeError,
                        ValueError
                    ):
                        pass

                return data

    except (
        FileNotFoundError,
        json.JSONDecodeError,
        OSError
    ):
        pass

    return {
        "enabled": False,
        "title": "",
        "videoId": ""
    }


def write_featured_video(data):

    temp_file = (
        FEATURED_VIDEO_FILE + ".tmp"
    )

    with open(
        temp_file,
        "w",
        encoding="utf-8"
    ) as file:

        json.dump(
            data,
            file,
            indent=2
        )

        file.write("\n")

    os.replace(
        temp_file,
        FEATURED_VIDEO_FILE
    )


@app.route(
    "/api/live-event-status",
    methods=["GET"]
)
def live_event_status():

    data = read_featured_video()

    response = jsonify({
        "enabled":
            bool(data.get("enabled")),

        "title":
            str(
                data.get("title")
                or ""
            ),

        "videoId":
            str(
                data.get("videoId")
                or ""
            )
    })

    response.headers[
        "Cache-Control"
    ] = "no-store"

    return response


@app.route(
    "/api/live-event-start",
    methods=["POST"]
)
def live_event_start():

    data = request.get_json(
        silent=True
    ) or {}

    if not valid_admin_password(
        data.get("password")
    ):

        return jsonify({
            "success": False,
            "error":
                "Incorrect SkyFam admin password."
        }), 403

    video_id = (
        extract_youtube_video_id(
            data.get("url")
        )
    )

    if not video_id:

        return jsonify({
            "success": False,
            "error":
                "Enter a valid YouTube video or live-event URL."
        }), 400

    title = str(
        data.get("title")
        or ""
    ).strip()

    if not title:
        title = "Live YouTube Event"

    write_featured_video({
        "enabled": True,
        "title": title,
        "videoId": video_id,
        "startedAt": time.time()
    })

    return jsonify({
        "success": True,
        "message":
            "Live event started.",
        "videoId":
            video_id,
        "title":
            title
    })


@app.route(
    "/api/live-event-stop",
    methods=["POST"]
)
def live_event_stop():

    # Stopping an event is intentionally not
    # password protected. Starting one still is.
    write_featured_video({
        "enabled": False,
        "title": "",
        "videoId": "",
        "startedAt": None
    })

    return jsonify({
        "success": True,
        "message":
            "Live event stopped."
    })



@app.route(
    "/api/youtube-key-status",
    methods=["GET"]
)
def youtube_key_status():

    configured = bool(
        read_env_value(
            YOUTUBE_ENV_FILE,
            "YOUTUBE_API_KEY"
        )
    )

    response = jsonify({
        "configured": configured
    })

    response.headers["Cache-Control"] = "no-store"

    return response


@app.route(
    "/api/admin-password-change",
    methods=["POST"]
)
def admin_password_change():

    data = request.get_json(
        silent=True
    ) or {}

    current_password = str(
        data.get("current_password") or ""
    )

    new_password = str(
        data.get("new_password") or ""
    )

    if not valid_admin_password(
        current_password
    ):
        return jsonify({
            "success": False,
            "error":
                "Current SkyFam admin password is incorrect."
        }), 403

    if len(new_password) < 8:
        return jsonify({
            "success": False,
            "error":
                "New password must be at least 8 characters."
        }), 400

    if len(new_password) > 200:
        return jsonify({
            "success": False,
            "error":
                "New password is too long."
        }), 400

    if (
        "\n" in new_password
        or "\r" in new_password
    ):
        return jsonify({
            "success": False,
            "error":
                "Password cannot contain line breaks."
        }), 400

    if new_password != new_password.strip():
        return jsonify({
            "success": False,
            "error":
                "Password cannot begin or end with spaces."
        }), 400

    if hmac.compare_digest(
        current_password,
        new_password
    ):
        return jsonify({
            "success": False,
            "error":
                "New password must be different from the current password."
        }), 400

    temp_file = ADMIN_ENV_FILE + ".tmp"

    try:
        with open(
            temp_file,
            "w",
            encoding="utf-8"
        ) as file:
            file.write(
                "SKYFAM_ADMIN_PASSWORD="
                + new_password
                + "\n"
            )

        os.chmod(
            temp_file,
            0o600
        )

        os.replace(
            temp_file,
            ADMIN_ENV_FILE
        )

        os.chmod(
            ADMIN_ENV_FILE,
            0o600
        )

    except Exception:
        try:
            if os.path.exists(temp_file):
                os.remove(temp_file)
        except Exception:
            pass

        return jsonify({
            "success": False,
            "error":
                "Unable to update the admin password."
        }), 500

    return jsonify({
        "success": True,
        "message":
            "SkyFam admin password changed successfully."
    })


@app.route(
    "/api/youtube-key-test",
    methods=["POST"]
)
def youtube_key_test():

    data = request.get_json(
        silent=True
    ) or {}

    if not valid_admin_password(
        data.get("password")
    ):

        return jsonify({
            "success": False,
            "error":
                "Incorrect SkyFam admin password."
        }), 403

    success, message = test_youtube_key(
        data.get("api_key")
    )

    return jsonify({
        "success": success,
        "message": message
    }), 200 if success else 400


@app.route(
    "/api/youtube-key-save",
    methods=["POST"]
)
def youtube_key_save():

    data = request.get_json(
        silent=True
    ) or {}

    if not valid_admin_password(
        data.get("password")
    ):

        return jsonify({
            "success": False,
            "error":
                "Incorrect SkyFam admin password."
        }), 403

    api_key = str(
        data.get("api_key") or ""
    ).strip()

    success, message = test_youtube_key(
        api_key
    )

    if not success:

        return jsonify({
            "success": False,
            "error": message
        }), 400

    temp_file = YOUTUBE_ENV_FILE + ".tmp"

    with open(
        temp_file,
        "w",
        encoding="utf-8"
    ) as file:

        file.write(
            "YOUTUBE_API_KEY="
            + api_key
            + "\n"
        )

    os.chmod(
        temp_file,
        0o600
    )

    os.replace(
        temp_file,
        YOUTUBE_ENV_FILE
    )

    try:

        subprocess.run(
            [
                "/usr/bin/python3",
                "/opt/dashboard/check_live_channel.py"
            ],
            cwd="/opt/dashboard",
            timeout=20,
            check=False,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL
        )

    except Exception:
        pass

    return jsonify({
        "success": True,
        "message":
            "YouTube API key saved."
    })


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
