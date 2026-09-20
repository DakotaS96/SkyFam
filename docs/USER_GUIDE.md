# SkyFam User Guide

This guide covers everyday SkyFam features that may not be obvious from the main dashboard, including photo management, administrator controls, Live Events, YouTube setup, and radio settings.

---

# How To: Add or Manage Slideshow Photos

SkyFam's photo-management controls are intentionally kept out of the normal dashboard view.

## Open Photo Management

1. Open the SkyFam dashboard.
2. Find the **camera icon** used for Photos.
3. **Press and hold the camera icon** instead of tapping it normally.
4. The window will open to allow photos to be uploaded.

From there, you can add photos for the SkyFam slideshow.

A normal click or tap is used to return to photos if playing a game. The press-and-hold action is what opens photo management.

---

# How To: Open SkyFam Admin

SkyFam has a hidden administrator page so normal dashboard users do not accidentally change system-wide settings.

## Open the Admin Page

1. Open the SkyFam dashboard.
2. Find the embedded **YallBot Live** YouTube window.
3. **Press and hold the YallBot Live text**.
4. The **SkyFam Admin** page will open.

The administrator page contains three tabs:

- **API Settings**
- **Live Event**
- **Password**

Administrative actions require the **SkyFam Admin Password** that was created during installation.

This password is separate from the Debian/Linux root password and created during the install.sh was run.

---

# API Settings

The **API Settings** tab configures the optional YouTube Data API used by SkyFam.

SkyFam can use this API to:

- Automatically detect when the configured Ryan Hall livestream is live
- Locate the current YouTube livestream
- Improve automatic YallBot Live behavior

The YouTube API is optional. If no valid key has been configured, automatic Ryan Hall live detection is disabled.

## What the fields mean

### YouTube Data API v3 Key

Paste your Google **YouTube Data API v3** key here.

The key is stored on the SkyFam server rather than on individual display devices.

For step-by-step instructions for creating a key, see:

[YouTube API Setup](YOUTUBE_API_SETUP.md)

### SkyFam Admin Password

Enter your current SkyFam administrator password.

This prevents someone using one of the dashboard displays from changing the server's API configuration without authorization.

## Buttons

### Test Key

Checks whether the entered YouTube API key is valid before saving it.

It is a good idea to use **Test Key** before saving a new key.

### Save

Stores the API key on the SkyFam server.

### Cancel

Leaves the page without saving the new value.

---

# Live Event

The **Live Event** tab lets the administrator manually send a YouTube livestream or video to the YallBot Window

This is useful for things such as:

- Family events
- Graduations
- News or weather coverage
- Special livestreams
- Any YouTube video you want everyone watching at the same time

A manual Live Event temporarily takes priority over normal automatic YallBot Live detection.

## What the fields mean

### YouTube Live/Event URL

Paste the full YouTube URL for the video or livestream you want SkyFam to display.

For example:

```text
https://www.youtube.com/watch?v=...
