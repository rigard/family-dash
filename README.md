# Our Home

A simple, full-screen family dashboard for a wall-mounted tablet or home computer.

## Features

- Shows a morning checklist, local weather, and word of the day from 6:30–8:00 in the device's local time.
- Rotates through family values, the word of the day, a photo, and an interesting fact during the rest of the day. Use the arrows or left/right keys to move between highlights.
- Opens a chores checklist from the header; checklist progress is saved in the browser for the day.
- Keeps morning and chore checkmarks on the device, without requiring an account.
- Requests location only when the weather control is tapped. Weather is provided by Open-Meteo.

## Run it

Open `index.html` in a modern browser, or serve this folder over HTTPS for a wall display. Weather requires location permission and an internet connection. Google Fonts and the featured photos also load from the internet.

## Make it yours

Edit the example names and morning tasks in `morningTasks`, the chore list in `chores`, and the family highlights in `highlights` in `app.js`. Change the weather temperature unit in the `loadWeather` function if your family uses Celsius.