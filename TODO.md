# TODO — polish for step 7

- Hero: proper mobile layout (currently minimal fallback). Only change positions and framing; keep the scroll transition and all other effects as they are:
  - Tagline sits on the right side of the window.
  - Location, date and time on one line. "Gunskirchen, Austria" may wrap to two lines so everything else fits on that line with proper spacing between items.
  - Status goes in the left bottom corner of the window frame.
  - Portrait cropped to fit the hero section exactly. Scrolling should run the usual transition and land on About, not on the end of the picture.
- Hero: remove the full-name link in the top-left corner (the back-to-top arrow covers that). Keep the name link in the project detail views.
- Add a custom 404 page (app/not-found.tsx): dark theme, same frame/nav/progress bar/mail button, "404" huge in the display face with the line-mask reveal, a mono line like "This page doesn't exist (yet)", and a "Back home →" link that routes through the page transition. Keep it consistent with the detail pages' layout.

## First-visit glitches (only the first time; fine afterwards)

- Nav menu: every time the menu is opened, "About" appears later than the other menu items.
- Footer: the first time you scroll to the very bottom, the top of the "Get in touch" title is cropped for about a milisecond, then it renders correctly on its own.