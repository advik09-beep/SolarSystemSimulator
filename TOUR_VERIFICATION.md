# LunLux embedded Tour — fork verification (15 November 2026)

**Scope:** `advik09-beep/SolarSystemSimulator` only. No changes were made to `Lunar-Landing-Hackathon`, its deck, or its `STATUS.md`.

## Changes and build checkpoints

| Step | Fork commit | Vercel status | Check |
| --- | --- | --- | --- |
| 1. Embedded labels | `958752da2c46cf3dd50906d702301a98b1cc0250` | READY | TypeScript and Vite production build passed. `buildAllLabels()` only passes ten permitted bodies to the CSS2D label builder in `lunarEmbed=1`; all underlying bodies remain rendered. |
| 2. Embedded palette | `9133bb10ebfd3885b4f1a5eda232312aa3671cc5` | READY | TypeScript and Vite production build passed. The embedded UI uses the LunLux neutral palette, with gold only for the Sun accent and blue only for Earth. Standalone simulator theme unchanged. |
| 3. README + NOTICE | `4321868b8b0c9b16e7f86da694efc0747120cb61` | READY | TypeScript and Vite production build passed. Exactly 12 retained `public/textures/` files counted and attributed to Solar System Scope, CC BY 4.0. |
| 4. Clock visibility safeguard | `ab43a420b95d50cb32f1a8583c96757d92de37f0` | READY | TypeScript and Vite production build passed. Incoming valid parent clock messages now update the date overlay immediately, even between animation frames. |

The live LunLux site embeds
`https://solar-system-simulator-usmdo-club.vercel.app/?lunarEmbed=1&parentOrigin=...`.
This alias was found pinned to an older deployment of **the same simulator fork**.
It was reassigned to the current simulator-fork deployment. No main-repository
configuration or code was changed.

## Live browser verification

Ran headless Chromium/Playwright against the **actual live LunLux page** and its
cross-origin simulator iframe, after the Vercel builds were READY.

- **Ten stops:** Sun → Mercury → Venus → Earth → Mars → Jupiter → Saturn →
  Uranus → Neptune → Moon. Each stop displayed its corresponding title in
  the visible Tour caption.
- **Excluded labels:** embedded label construction is limited to those ten
  IDs; the other spacecraft/moons/asteroids remain part of the simulation.
  CSS2D labels may be culled when bodies are offscreen.
- **Moon stop:** the anchored text and button both read
  **"Click here to go to the Moon"**. The target is hidden at the first nine
  stops and shown only at the final Moon stop. The button handler in source
  sends `lunar-navigator:open-explore` to the permitted parent origin.
- **Theme:** computed iframe styles confirmed background `rgb(10,10,11)`,
  Tour panel `rgba(28,28,30,0.9)`, Tour button background
  `rgb(232,228,218)`, and text `rgb(10,10,11)`.
  The embedded simulator sound toggle is absent.
- **Date synchronization:** after the Tour started, a valid parent
  `lunar-navigator:set-clock` message immediately updated the date.
  A simulated change to the site's `#landing-date` control changed the
  site date and the iframe display to **2027-07-12** in the same browser test.
  An earlier separate test also matched **2027-06-17** on both.
- **Assets and errors:** the full ten-stop + date regression reported
  **zero page errors, zero HTTP 400+ responses and zero failed requests**.
  All six removed texture paths remain absent from the fork; the 12
  retained files are present. No missing-texture requests were observed.

## Limits of this check

- The final Moon button **is present and has its message handler**, but the
  full transition into LunLux's heavier Explore view could not be
  independently certified: a headless Chromium run lost its browser process
  during that transition. Manual visual click-through remains advisable.
- The date control was exercised using its normal DOM input/change events
  from automation; a manual interaction on the visible site UI was not done.
- The iframe's initial displayed clock sometimes lagged during boot; the
  direct-message date safeguard and the site-control update both passed
  after initialization.

All notes and source changes are confined to this simulator fork.
