import os

YOUTUBE_ENV_FILE = "/etc/skyfam-youtube.env"

LIVE_CHANNEL_ID = "UCJHAT3Uvv-g3I8H3GhHWV7w"


def _read_env_value(path, name):

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

                if key.strip() == name:

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


YOUTUBE_API_KEY = (
    os.environ.get(
        "YOUTUBE_API_KEY",
        ""
    ).strip()
    or _read_env_value(
        YOUTUBE_ENV_FILE,
        "YOUTUBE_API_KEY"
    )
)
