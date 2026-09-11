from flask import Flask, render_template, request, redirect, send_from_directory
from werkzeug.utils import secure_filename
from datetime import datetime
import os
import json

app = Flask(__name__)
app.config['PREFERRED_URL_SCHEME'] = 'https'
BASE_DIR = "/opt/familychat"
UPLOAD_DIR = f"{BASE_DIR}/static/uploads"
MESSAGES_FILE = f"{BASE_DIR}/messages.json"

ALLOWED_EXTENSIONS = {"jpg", "jpeg", "png", "gif", "webp", "mp4", "mov", "webm"}

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

            if (
                stored_name != request_name
                and request_name != "silver"
            ):
                return {
                    "error": f"Unauthorized ({request_name} != {stored_name})"
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
