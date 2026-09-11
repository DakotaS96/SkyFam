from flask import Flask, request, jsonify, send_from_directory
from werkzeug.utils import secure_filename
from pathlib import Path
import json
import os
import requests
import uuid

BASE_DIR = Path("/opt/skyfam-radio")
STATIONS_FILE = BASE_DIR / "stations.json"
LOGO_DIR = BASE_DIR / "logos"

ADMIN_PASSWORD = os.environ.get("SKYFAM_ADMIN_PASSWORD", "")

app = Flask(__name__)
LOGO_DIR.mkdir(parents=True, exist_ok=True)


@app.route("/")
def index():
    return send_from_directory(BASE_DIR, "index.html")


@app.route("/radar")
def radar():
    return send_from_directory(
        BASE_DIR,
        "radar.html"
    )


@app.route("/stations.json")
def stations():
    return send_from_directory(BASE_DIR, "stations.json")


@app.route("/logos/<path:filename>")
def logos(filename):
    return send_from_directory(LOGO_DIR, filename)


@app.route("/add_station", methods=["POST"])
def add_station():
    try:
        password = request.form.get("password", "")

        if not ADMIN_PASSWORD or password != ADMIN_PASSWORD:
            return jsonify({"error": "Incorrect admin password"}), 403

        name = request.form.get("name", "").strip()
        city = request.form.get("city", "").strip()
        genre = request.form.get("genre", "").strip()
        tag = request.form.get("tag", "").strip()
        stream = request.form.get("stream", "").strip()

        if not name or not stream:
            return jsonify({
                "error": "Station name and stream URL are required"
            }), 400

        logo = request.files.get("logo")

        if not logo or not logo.filename:
            return jsonify({"error": "A station logo is required"}), 400

        original_name = secure_filename(logo.filename)

        if not original_name:
            original_name = "station-logo"

        filename = f"{uuid.uuid4().hex}_{original_name}"
        logo.save(LOGO_DIR / filename)

        if STATIONS_FILE.exists():
            with STATIONS_FILE.open("r", encoding="utf-8") as file:
                data = json.load(file)
        else:
            data = {"stations": []}

        data.setdefault("stations", [])

        orders = [
            station.get("order", 0)
            for station in data["stations"]
            if isinstance(station.get("order", 0), int)
        ]

        new_station = {
            "order": max(orders, default=0) + 1,
            "name": name,
            "city": city,
            "genre": genre,
            "tag": tag,
            "logo": f"logos/{filename}",
            "stream": stream
        }

        data["stations"].append(new_station)

        temporary_file = STATIONS_FILE.with_suffix(".json.tmp")

        with temporary_file.open("w", encoding="utf-8") as file:
            json.dump(data, file, indent=2)

        temporary_file.replace(STATIONS_FILE)

        return jsonify({
            "status": "ok",
            "station": new_station
        })

    except Exception as error:
        app.logger.exception("Unable to add station")
        return jsonify({"error": str(error)}), 500


def radio_browser_request(path, params=None):
    """
    Query Radio Browser using one of its mirrors.
    """
    headers = {
        "User-Agent": "SkyFam/0.1",
        "Accept": "application/json"
    }

    # Bootstrap from one server, then use the mirror list it provides.
    bootstrap = "https://de1.api.radio-browser.info"

    servers = []

    try:
        response = requests.get(
            bootstrap + "/json/servers",
            headers=headers,
            timeout=5
        )
        response.raise_for_status()

        for item in response.json():
            name = str(item.get("name", "")).strip()

            if name and name not in servers:
                servers.append(name)

    except Exception as error:
        app.logger.debug(
            "Unable to retrieve Radio Browser mirror list: %s",
            error
        )

    if "de1.api.radio-browser.info" not in servers:
        servers.append("de1.api.radio-browser.info")

    last_error = None

    for server_name in servers:
        try:
            response = requests.get(
                f"https://{server_name}{path}",
                params=params or {},
                headers=headers,
                timeout=8
            )
            response.raise_for_status()
            return response.json()

        except Exception as error:
            last_error = error

    raise RuntimeError(
        f"Radio Browser unavailable: {last_error}"
    )


@app.route("/radio_search")
def radio_search():
    query = request.args.get("q", "").strip()

    if len(query) < 2:
        return jsonify([])

    try:
        # Search station names first.
        results = radio_browser_request(
            "/json/stations/search",
            {
                "name": query,
                "hidebroken": "true",
                "order": "clickcount",
                "reverse": "true",
                "limit": 20
            }
        )

        cleaned = []

        for station in results:
            stream = str(
                station.get("url_resolved")
                or station.get("url")
                or ""
            ).strip()

            # SkyFam is intended to work cleanly over HTTPS.
            # Do not offer HTTP-only Radio Browser streams.
            if not stream.lower().startswith("https://"):
                continue

            cleaned.append({
                "stationuuid": station.get("stationuuid", ""),
                "name": station.get("name", "").strip(),
                "stream": stream,
                "country": station.get("country", "").strip(),
                "countrycode": station.get("countrycode", "").strip(),
                "state": station.get("state", "").strip(),
                "tags": station.get("tags", "").strip(),
                "codec": station.get("codec", "").strip(),
                "bitrate": station.get("bitrate", 0),
                "homepage": station.get("homepage", "").strip()
            })

        return jsonify(cleaned)

    except Exception as error:
        app.logger.exception("Radio Browser search failed")
        return jsonify({
            "error": str(error)
        }), 502




def clean_radio_browser_name(value):
    name = " ".join(
        str(value or "").split()
    ).strip()

    name = name.lstrip("#•*- ").strip()

    if not name:
        return "Internet Radio"

    max_length = 60

    if len(name) > max_length:
        shortened = name[:max_length].rstrip()

        if " " in shortened:
            shortened = shortened.rsplit(
                " ",
                1
            )[0]

        name = shortened + "…"

    return name


def clean_radio_browser_tags(value):
    raw_tags = str(
        value or ""
    ).split(",")

    cleaned = []
    seen = set()

    for tag in raw_tags:
        tag = " ".join(
            tag.strip()
            .lstrip("#")
            .split()
        )

        if not tag:
            continue

        # Ignore giant descriptions masquerading as tags.
        if len(tag) > 28:
            continue

        key = tag.lower()

        if key in seen:
            continue

        seen.add(key)

        tag = tag.title()
        cleaned.append(tag)

        if len(cleaned) >= 5:
            break

    return ", ".join(cleaned)


def clean_radio_browser_country(value):
    country = " ".join(
        str(value or "").split()
    ).strip()

    if country.lower() in {
        "united states of america",
        "the united states of america",
        "united states",
        "the united states"
    }:
        return "USA"

    return country


@app.route(
    "/add_radio_browser_station",
    methods=["POST"]
)
def add_radio_browser_station():
    try:
        payload = request.get_json(
            silent=True
        ) or {}

        password = str(
            payload.get(
                "password",
                ""
            )
        )

        if (
            not ADMIN_PASSWORD
            or password != ADMIN_PASSWORD
        ):
            return jsonify({
                "error":
                    "Incorrect admin password"
            }), 403

        original_name = str(
            payload.get(
                "name",
                ""
            )
        ).strip()

        name = clean_radio_browser_name(
            original_name
        )

        stream = str(
            payload.get(
                "stream",
                ""
            )
        ).strip()

        stationuuid = str(
            payload.get(
                "stationuuid",
                ""
            )
        ).strip()

        state = " ".join(
            str(
                payload.get(
                    "state",
                    ""
                )
            ).split()
        ).strip()

        country = clean_radio_browser_country(
            payload.get(
                "country",
                ""
            )
        )

        tags = clean_radio_browser_tags(
            payload.get(
                "tags",
                ""
            )
        )

        if not name or not stream:
            return jsonify({
                "error":
                    "Station name and stream URL are required"
            }), 400

        # SkyFam Radio Browser entries must be HTTPS.
        if not stream.lower().startswith(
            "https://"
        ):
            return jsonify({
                "error":
                    "Only HTTPS radio streams can be added"
            }), 400

        if not STATIONS_FILE.exists():
            return jsonify({
                "error":
                    "stations.json is missing"
            }), 500

        with STATIONS_FILE.open(
            "r",
            encoding="utf-8"
        ) as file:
            data = json.load(file)

        if not isinstance(
            data.get("stations"),
            list
        ):
            return jsonify({
                "error":
                    "Invalid stations.json format"
            }), 500

        # Duplicate protection.
        for existing in data["stations"]:

            if (
                stationuuid
                and existing.get(
                    "stationuuid"
                ) == stationuuid
            ):
                return jsonify({
                    "error":
                        "That station is already added"
                }), 409

            if (
                existing.get(
                    "stream"
                ) == stream
            ):
                return jsonify({
                    "error":
                        "That stream is already added"
                }), 409

        orders = [
            station.get(
                "order",
                0
            )
            for station
            in data["stations"]
            if isinstance(
                station.get(
                    "order",
                    0
                ),
                int
            )
        ]

        location = ", ".join(
            item
            for item in [
                state,
                country
            ]
            if item
        )

        new_station = {
            "order":
                max(
                    orders,
                    default=0
                ) + 1,

            "name":
                name,

            "city":
                location,

            "genre":
                tags,

            "tag":
                "Radio Browser",

            "logo":
                "logos/default-radio.svg",

            "stream":
                stream,

            "source":
                "radio-browser",

            "stationuuid":
                stationuuid,

            "radio_browser_original_name":
                original_name
        }

        data["stations"].append(
            new_station
        )

        temporary_file = (
            STATIONS_FILE.with_suffix(
                ".json.tmp"
            )
        )

        with temporary_file.open(
            "w",
            encoding="utf-8"
        ) as file:
            json.dump(
                data,
                file,
                indent=2
            )

        temporary_file.replace(
            STATIONS_FILE
        )

        return jsonify({
            "status": "ok",
            "station": new_station
        })

    except Exception as error:
        app.logger.exception(
            "Unable to add Radio Browser station"
        )

        return jsonify({
            "error": str(error)
        }), 500



@app.route("/radio_browser_click", methods=["POST"])
def radio_browser_click():
    stationuuid = request.json.get("stationuuid", "").strip()

    if not stationuuid:
        return jsonify({"status": "ignored"})

    try:
        radio_browser_request(
            f"/json/url/{stationuuid}"
        )

        return jsonify({"status": "ok"})

    except Exception as error:
        app.logger.debug(
            "Unable to register Radio Browser click: %s",
            error
        )

        return jsonify({"status": "ignored"})





@app.route(
    "/edit_station",
    methods=["POST"]
)
def edit_station():
    try:
        password = request.form.get(
            "password",
            ""
        )

        if (
            not ADMIN_PASSWORD
            or password != ADMIN_PASSWORD
        ):
            return jsonify({
                "error":
                    "Incorrect admin password"
            }), 403

        original_stream = request.form.get(
            "original_stream",
            ""
        ).strip()

        name = request.form.get(
            "name",
            ""
        ).strip()

        city = request.form.get(
            "city",
            ""
        ).strip()

        genre = request.form.get(
            "genre",
            ""
        ).strip()

        tag = request.form.get(
            "tag",
            ""
        ).strip()

        stream = request.form.get(
            "stream",
            ""
        ).strip()

        if not original_stream:
            return jsonify({
                "error":
                    "Original stream is missing"
            }), 400

        if not name or not stream:
            return jsonify({
                "error":
                    "Station name and stream URL are required"
            }), 400

        if not STATIONS_FILE.exists():
            return jsonify({
                "error":
                    "stations.json not found"
            }), 404

        with STATIONS_FILE.open(
            "r",
            encoding="utf-8"
        ) as file:
            data = json.load(file)

        if not isinstance(
            data.get("stations"),
            list
        ):
            return jsonify({
                "error":
                    "Invalid stations.json format"
            }), 500

        station = next(
            (
                item
                for item in data["stations"]
                if item.get(
                    "stream"
                ) == original_stream
            ),
            None
        )

        if station is None:
            return jsonify({
                "error":
                    "Station not found"
            }), 404

        old_logo = str(
            station.get(
                "logo",
                ""
            )
        )

        new_logo = request.files.get(
            "logo"
        )

        new_logo_path = None

        if (
            new_logo is not None
            and new_logo.filename
            and new_logo.filename.strip()
        ):
            extension = Path(
                new_logo.filename
            ).suffix.lower()

            allowed_extensions = {
                ".jpg",
                ".jpeg",
                ".png",
                ".gif",
                ".webp",
                ".svg"
            }

            if extension not in allowed_extensions:
                return jsonify({
                    "error":
                        "Unsupported logo file type"
                }), 400

            LOGO_DIR.mkdir(
                parents=True,
                exist_ok=True
            )

            filename = (
                f"{uuid.uuid4().hex}"
                f"{extension}"
            )

            new_logo_path = (
                LOGO_DIR / filename
            )

            new_logo.save(
                str(new_logo_path)
            )

            if (
                not new_logo_path.exists()
                or new_logo_path.stat().st_size == 0
            ):
                return jsonify({
                    "error":
                        "Replacement logo could not be saved"
                }), 500

            station["logo"] = (
                f"logos/{filename}"
            )

        station["name"] = name
        station["city"] = city
        station["genre"] = genre
        station["tag"] = tag
        station["stream"] = stream

        temporary_file = (
            STATIONS_FILE.with_suffix(
                ".json.tmp"
            )
        )

        with temporary_file.open(
            "w",
            encoding="utf-8"
        ) as file:
            json.dump(
                data,
                file,
                indent=2
            )

        temporary_file.replace(
            STATIONS_FILE
        )

        # Delete old uploaded logo only after JSON
        # has safely been written.
        if (
            new_logo_path
            and old_logo.startswith(
                "logos/"
            )
            and old_logo
                != "logos/default-radio.svg"
            and old_logo
                != station.get("logo")
        ):
            old_logo_path = (
                LOGO_DIR
                / Path(old_logo).name
            )

            try:
                if old_logo_path.exists():
                    old_logo_path.unlink()

            except Exception as error:
                app.logger.warning(
                    "Unable to remove old logo %s: %s",
                    old_logo_path,
                    error
                )

        return jsonify({
            "status": "ok",
            "station": station
        })

    except Exception as error:
        app.logger.exception(
            "Unable to edit station"
        )

        return jsonify({
            "error": str(error)
        }), 500


@app.route("/delete_station", methods=["POST"])
def delete_station():
    try:
        payload = request.get_json(silent=True) or {}

        password = str(
            payload.get("password", "")
        )

        if not ADMIN_PASSWORD or password != ADMIN_PASSWORD:
            return jsonify({
                "error": "Incorrect admin password"
            }), 403

        stream = str(
            payload.get("stream", "")
        ).strip()

        if not stream:
            return jsonify({
                "error": "Station stream is required"
            }), 400

        if not STATIONS_FILE.exists():
            return jsonify({
                "error": "Station list not found"
            }), 404

        with STATIONS_FILE.open(
            "r",
            encoding="utf-8"
        ) as file:
            data = json.load(file)

        stations = data.get("stations", [])

        station_to_delete = next(
            (
                station
                for station in stations
                if station.get("stream") == stream
            ),
            None
        )

        if station_to_delete is None:
            return jsonify({
                "error": "Station not found"
            }), 404

        data["stations"] = [
            station
            for station in stations
            if station.get("stream") != stream
        ]

        # Delete a locally uploaded station logo,
        # but never delete the shared default icon.
        logo = str(
            station_to_delete.get("logo", "")
        )

        if (
            logo.startswith("logos/")
            and logo != "logos/default-radio.svg"
        ):
            logo_name = Path(logo).name
            logo_path = LOGO_DIR / logo_name

            try:
                if logo_path.exists():
                    logo_path.unlink()
            except Exception as error:
                app.logger.warning(
                    "Unable to remove station logo %s: %s",
                    logo_path,
                    error
                )

        temporary_file = STATIONS_FILE.with_suffix(
            ".json.tmp"
        )

        with temporary_file.open(
            "w",
            encoding="utf-8"
        ) as file:
            json.dump(
                data,
                file,
                indent=2
            )

        temporary_file.replace(
            STATIONS_FILE
        )

        return jsonify({
            "status": "ok"
        })

    except Exception as error:
        app.logger.exception(
            "Unable to delete station"
        )

        return jsonify({
            "error": str(error)
        }), 500


@app.route(
    "/reorder_stations",
    methods=["POST"]
)
def reorder_stations():
    try:
        payload = (
            request.get_json(
                silent=True
            )
            or {}
        )

        password = str(
            payload.get(
                "password",
                ""
            )
        )

        if (
            not ADMIN_PASSWORD
            or password
            != ADMIN_PASSWORD
        ):
            return jsonify({
                "error":
                    "Incorrect admin password"
            }), 403

        requested_streams = (
            payload.get(
                "streams"
            )
            or []
        )

        if not isinstance(
            requested_streams,
            list
        ):
            return jsonify({
                "error":
                    "Invalid station order"
            }), 400

        requested_streams = [
            str(stream).strip()
            for stream
            in requested_streams
            if str(stream).strip()
        ]

        if not STATIONS_FILE.exists():
            return jsonify({
                "error":
                    "Station list not found"
            }), 404

        with STATIONS_FILE.open(
            "r",
            encoding="utf-8"
        ) as file:
            data = json.load(file)

        stations = data.get(
            "stations",
            []
        )

        if not isinstance(
            stations,
            list
        ):
            return jsonify({
                "error":
                    "Invalid stations.json format"
            }), 500

        station_by_stream = {
            str(
                station.get(
                    "stream",
                    ""
                )
            ):
                station
            for station
            in stations
        }

        current_streams = list(
            station_by_stream.keys()
        )

        if (
            len(requested_streams)
            != len(current_streams)
            or set(requested_streams)
            != set(current_streams)
        ):
            return jsonify({
                "error":
                    "Station list changed. Refresh and try again."
            }), 409

        reordered = [
            station_by_stream[
                stream
            ]
            for stream
            in requested_streams
        ]

        for position, station in enumerate(
            reordered,
            start=1
        ):
            station["order"] = position

        data["stations"] = reordered

        temporary_file = (
            STATIONS_FILE.with_suffix(
                ".json.tmp"
            )
        )

        with temporary_file.open(
            "w",
            encoding="utf-8"
        ) as file:
            json.dump(
                data,
                file,
                indent=2
            )

        temporary_file.replace(
            STATIONS_FILE
        )

        return jsonify({
            "status": "ok"
        })

    except Exception as error:

        app.logger.exception(
            "Unable to reorder stations"
        )

        return jsonify({
            "error":
                str(error)
        }), 500


@app.route("/metadata")
def metadata():
    from urllib.parse import urlparse

    stream = request.args.get("stream", "").strip()

    if not stream:
        return jsonify({"title": None})

    try:
        parsed = urlparse(stream)
        hostname = (parsed.hostname or "").lower()

        # Icecast metadata used by NK Streaming stations.
        if hostname.endswith("nkstreaming.com"):
            status_url = (
                f"{parsed.scheme or 'https'}://"
                f"{parsed.netloc}/status-json.xsl"
            )

            response = requests.get(status_url, timeout=5)
            response.raise_for_status()

            source = response.json().get(
                "icestats", {}
            ).get("source")

            sources = source if isinstance(source, list) else [source]
            sources = [item for item in sources if isinstance(item, dict)]

            selected = None
            requested_path = parsed.path.rstrip("/").lower()

            # Select the metadata entry matching the chosen stream mount.
            for item in sources:
                listen_url = str(item.get("listenurl", ""))
                listen_path = urlparse(listen_url).path.rstrip("/").lower()

                if requested_path and listen_path == requested_path:
                    selected = item
                    break

            if selected is None and sources:
                selected = sources[0]

            if selected:
                title = selected.get("title")

                # Do not substitute server/genre values as song titles.
                if title:
                    return jsonify({"title": str(title).strip()})

        return jsonify({"title": None})

    except Exception as error:
        app.logger.debug("Metadata unavailable: %s", error)
        return jsonify({"title": None})


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5080,
        debug=False
    )
