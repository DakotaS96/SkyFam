from flask import Flask, render_template, request, redirect, send_from_directory, session
from werkzeug.utils import secure_filename
from datetime import datetime
import os
import json
import hmac
import hashlib

app = Flask(__name__)
app.config['PREFERRED_URL_SCHEME'] = 'https'
BASE_DIR = "/opt/familychat"
UPLOAD_DIR = f"{BASE_DIR}/static/uploads"
MESSAGES_FILE = f"{BASE_DIR}/messages.json"

ALLOWED_EXTENSIONS = {"jpg", "jpeg", "png", "gif", "webp", "mp4", "mov", "webm"}

ADMIN_ENV_FILE = "/etc/skyfam-admin.env"


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


def admin_password_value():

    return read_env_value(
        ADMIN_ENV_FILE,
        "SKYFAM_ADMIN_PASSWORD"
    )


def valid_admin_password(password):

    expected = admin_password_value()

    if not expected:
        return False

    return hmac.compare_digest(
        str(password or ""),
        expected
    )


def admin_password_fingerprint():

    expected = admin_password_value()

    if not expected:
        return ""

    return hashlib.sha256(
        expected.encode("utf-8")
    ).hexdigest()


def moderator_session_valid():

    if not session.get(
        "familychat_moderator"
    ):
        return False

    saved_fingerprint = str(
        session.get(
            "familychat_admin_fingerprint"
        ) or ""
    )

    current_fingerprint = (
        admin_password_fingerprint()
    )

    return bool(
        saved_fingerprint
        and current_fingerprint
        and hmac.compare_digest(
            saved_fingerprint,
            current_fingerprint
        )
    )


session_password = admin_password_value()

if session_password:
    session_secret = hashlib.sha256(
        (
            "skyfam-familychat-session:"
            + session_password
        ).encode("utf-8")
    ).digest()
else:
    session_secret = os.urandom(32)

app.config.update(
    SECRET_KEY=session_secret,
    SESSION_COOKIE_NAME=(
        "skyfam_familychat_session"
    ),
    SESSION_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SAMESITE="Lax",
)


os.makedirs(UPLOAD_DIR, exist_ok=True)

def load_messages():
    if not os.path.exists(MESSAGES_FILE):
        return []
    with open(MESSAGES_FILE, "r") as f:
        return json.load(f)

def save_messages(messages):
    with open(MESSAGES_FILE, "w") as f:
        json.dump(messages[-100:], f, indent=2)

def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route("/", methods=["GET", "POST"])
def chat():
    messages = load_messages()

    if request.method == "POST":
        name = request.form.get("name", "Family").strip() or "Family"
        text = request.form.get("message", "").strip()
        file = request.files.get("file")

        upload_url = None
        upload_type = None

        if file and file.filename and allowed_file(file.filename):
            filename = datetime.now().strftime("%Y%m%d%H%M%S_") + secure_filename(file.filename)
            path = os.path.join(UPLOAD_DIR, filename)
            file.save(path)
            upload_url = f"/static/uploads/{filename}"

            ext = filename.rsplit(".", 1)[1].lower()
            upload_type = "video" if ext in {"mp4", "mov", "webm"} else "image"

        if text or upload_url:
            messages.append({
                "name": name,
                "text": text,
                "time": datetime.now().strftime("%b %d, %I:%M %p"),
                "upload_url": upload_url,
                "upload_type": upload_type
            })
            save_messages(messages)

        return redirect("/")

    return render_template("chat.html", messages=messages)

@app.route(
    "/moderator_unlock",
    methods=["POST"]
)
def moderator_unlock():

    data = request.get_json(
        silent=True
    ) or {}

    if not valid_admin_password(
        data.get("password")
    ):
        return {
            "success": False,
            "error":
                "Incorrect SkyFam administrator password."
        }, 403

    session[
        "familychat_moderator"
    ] = True

    session[
        "familychat_admin_fingerprint"
    ] = admin_password_fingerprint()

    return {
        "success": True,
        "message":
            "Silver moderator mode unlocked."
    }


@app.route("/delete_message", methods=["POST"])
def delete_message():

    data = request.get_json()

    index = data.get("index")
    name = data.get("name")

    if index is None:
        return {"error": "Missing index"}, 400

    messages = load_messages()

    try:

        index = int(index)

        if 0 <= index < len(messages):

            msg = messages[index]

            stored_name = msg.get("name", "").strip().lower()
            request_name = (name or "").strip().lower()

            print("Stored:", stored_name)
            print("Request:", request_name)

            is_author = (
                stored_name == request_name
            )

            is_moderator = (
                request_name == "silver"
                and moderator_session_valid()
            )

            if (
                not is_author
                and not is_moderator
            ):

                if request_name == "silver":
                    return {
                        "error":
                            "Silver moderator authentication required.",
                        "requires_admin_password":
                            True
                    }, 403

                return {
                    "error":
                        "You can only delete your own messages."
                }, 403
            # Delete uploaded file too
            if msg.get("upload_url"):

                filename = msg["upload_url"].split("/")[-1]

                filepath = os.path.join(
                    UPLOAD_DIR,
                    filename
                )

                if os.path.exists(filepath):
                    os.remove(filepath)

            messages.pop(index)

            save_messages(messages)

        return {"success": True}

    except Exception as e:

        return {"error": str(e)}, 500

@app.route("/messages_json")
def messages_json():
    return load_messages()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5050)
