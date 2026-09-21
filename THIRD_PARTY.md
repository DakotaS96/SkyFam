# SkyFam Third-Party Software and Credits

SkyFam incorporates and adapts several open-source projects. SkyFam's
integration, dashboard, FamilyChat, radio interface, automation, and related
project-specific code are separate from these upstream projects.

The original authors and projects retain their respective copyrights and
licenses.

---

## Bubble Shooter

Based on:

**Bubble Shooter**  
Original project by Kenneth Korcal

Source:  
https://github.com/kakorcal/bubble-shooter

License: ISC

SkyFam includes the upstream source material and a browser-ready build under
`dashboard/games/bubbleshooter`.

The upstream project also includes third-party game-engine, graphics, audio,
and JavaScript dependencies. Their copyright and license notices remain in
the distributed source and generated files.

The original Bubble Shooter project includes additional music/audio credits,
including Phaser.js, FoxSynergy, bart, agcnf_media, MLMusic, ionics,
jabameister, and EpicStock.

SkyFam modifications include kiosk-oriented interface and navigation changes,
including removal of external/navigation elements and changes intended to keep
the game contained within the SkyFam dashboard. These modifications are not
part of the original upstream project.

---

## Mah - Mahjong Solitaire

**Mah - Mahjong Solitaire**  
Developer: ffalt

Source:  
https://github.com/ffalt/mah

License: MIT

SkyFam includes this project as its Mahjong game.

The upstream project's README and LICENSE are retained in the
`dashboard/games/mahjong` directory.

SkyFam includes local compatibility and kiosk-integration modifications.
These modifications are not part of the original upstream project.

---

## grrd's Puzzle

**grrd's Puzzle**  
Original project by Gerard Tyedmers

Source:  
https://github.com/grrd01/Puzzle

License: Mozilla Public License 2.0 (MPL-2.0)

Copyright (c) 2012 Gerard Tyedmers

The upstream README and LICENSE.txt are retained with the game.

SkyFam includes local compatibility and kiosk-integration modifications.
These modifications are not part of the original upstream project.

---

## Solitairey

SkyFam's Solitaire game is based on:

**Solitairey**

Current FOSS repository:  
https://github.com/foss-card-games/Solitairey

Original author: Paul Harrington

License: BSD 2-Clause License

Copyright (c) 2011 Paul Harrington

Solitairey also incorporates additional third-party libraries and software,
including YUI, RequireJS, Lodash/Underscore, Freecell Solver, and others.
Their existing copyright and license notices are retained within the
Solitaire directory.

SkyFam includes local interface, kiosk-integration, and gameplay-presentation
changes, including changes to the victory experience. These modifications are
not part of the original upstream project.

---

## Radio Browser

SkyFam can search for internet radio stations using the community-maintained [Radio Browser](https://www.radio-browser.info/) directory.

Radio Browser is an independent third-party service. SkyFam is not affiliated with or endorsed by Radio Browser or any station listed through its directory.

Radio Browser provides station information and streaming addresses. Audio is delivered by the individual station operators; SkyFam does not operate, host, rebroadcast, or control these streams.

Station availability, programming, stream reliability, names, trademarks, logos, artwork, and broadcasting rights remain the responsibility of their respective owners and operators. A station appearing in SkyFam does not imply endorsement by SkyFam.

SkyFam includes a small number of demonstration station entries to show how the radio interface works. Administrators may remove these entries, add their own compatible streams, or discover additional stations through Radio Browser.

---

## YouTube

SkyFam can optionally use the YouTube Data API v3 to detect when a configured
YouTube channel is broadcasting live.

YouTube, YouTube Data API, and associated trademarks are properties of
Google LLC. SkyFam is not affiliated with or endorsed by YouTube or Google.

API credentials are supplied by the SkyFam administrator and are not included
in the SkyFam source repository.

---

## Additional Libraries

Some bundled applications contain additional third-party libraries,
frameworks, artwork, audio, and other assets.

Their original copyright notices and license text are retained within their
respective source files and directories where provided by the upstream
projects.

If an attribution or license notice appears to be missing, please open an
issue so it can be reviewed and corrected.
