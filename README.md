# LodgeFinder

LodgeFinder is a Vanilla JavaScript ES-module MVC school project. Every screen is a View extending `js/views/View.js`; `js/model.js` stores and validates application data without DOM access; `js/controller.js` routes actions and selects the Views.

## Run locally

From the project directory in PowerShell:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\serve.ps1
```

Open <http://127.0.0.1:8000/>. The default admin demo account is `admin@lodgefinder.com` / `Admin123!`. New accounts are always created as guests.

## Demo security limitation

Roles, account data, lodges, bookings, and the current session are stored in browser `localStorage`. The Model and Controller check roles before administrative actions, but users can inspect or edit client-side JavaScript and storage. These checks are useful for demonstrating MVC permissions; they are **not production-grade security**. A public booking system must enforce authentication, authorization, input validation, and data ownership on a trusted server and database. Do not use real credentials or sensitive personal information in this demo.

The map uses Leaflet and OpenStreetMap; fonts and example lodge photography are loaded from external services.

## Publish with GitHub Pages

The GitHub Actions workflow publishes the site from the repository root whenever changes are pushed to `main`. In the repository's **Settings → Pages**, set the source to **GitHub Actions**. After the first successful deployment, the site is available at <https://roniemaynopas-ui.github.io/ITPFE-PROJECT/>.
