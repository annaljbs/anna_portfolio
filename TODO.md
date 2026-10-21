# TODO — polish for step 7

- Hero (mobile): tagline on the right side of the window. A first try (right-aligned) was reverted because the text jumped on refresh.
- Add a custom 404 page (app/not-found.tsx): dark theme, same frame/nav/progress bar/mail button, "404" huge in the display face with the line-mask reveal, a mono line like "This page doesn't exist (yet)", and a "Back home →" link that routes through the page transition. Keep it consistent with the detail pages' layout.

## First-visit glitches (only the first time; fine afterwards)

- Footer: the first time you scroll to the very bottom, the top of the "Get in touch" title is cropped for about a milisecond, then it renders correctly on its own.