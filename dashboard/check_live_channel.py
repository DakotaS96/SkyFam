import json
import requests

from youtube_config import (
    YOUTUBE_API_KEY,
    LIVE_CHANNEL_ID
)

STATUS_FILE = (
    "/opt/dashboard/static/"
    "live_channel.json"
)

URL = (
    "https://www.googleapis.com/"
    "youtube/v3/search"
)


def write_status(status):

    with open(
        STATUS_FILE,
        "w",
        encoding="utf-8"
    ) as file:

        json.dump(
            status,
            file,
            indent=4
        )


if not YOUTUBE_API_KEY:

    status = {
        "live": False,
        "videoId": None,
        "configured": False
    }

    write_status(status)

    print(status)

    raise SystemExit(0)


params = {
    "part": "snippet",
    "channelId": LIVE_CHANNEL_ID,
    "eventType": "live",
    "type": "video",
    "key": YOUTUBE_API_KEY
}

try:

    response = requests.get(
        URL,
        params=params,
        timeout=10
    )

    response.raise_for_status()

    data = response.json()

except Exception as error:

    status = {
        "live": False,
        "videoId": None,
        "configured": True,
        "available": False
    }

    write_status(status)

    print(
        "YouTube live check failed:",
        error
    )

    raise SystemExit(1)


status = {
    "live": False,
    "videoId": None,
    "configured": True,
    "available": True
}

if data.get("items"):

    item = data["items"][0]

    status = {
        "live": True,
        "videoId": item["id"]["videoId"],
        "title": item["snippet"]["title"],
        "configured": True,
        "available": True
    }


write_status(status)

print(status)
