# Wedding Planner

## Google Sheets data source

The app loads these public worksheets from Google Sheets when `VITE_GOOGLE_SHEET_ID` is set: `Settings`, `Places`, `People`, `Expenses`, and `Checklist`.

1. Create a Google Sheet with those worksheet names and share it as **Anyone with the link — Viewer**.
2. Use the exact header names shown below in row 1. Every data record needs an `id`; `placeId` values must match the relevant row in `Places`.
3. In GitHub, open **Settings → Secrets and variables → Actions → Variables**, create `GOOGLE_SHEET_ID`, and set it to the ID in the Sheet URL (between `/d/` and `/edit`).
4. Push again. The deployment workflow passes that variable to Vite at build time.

| Worksheet | Required headers |
| --- | --- |
| Settings | `brideName`, `groomName`, `weddingDate`, `totalBudget`, `currency`, `venueLocation`, `notes` |
| Places | `id`, `name`, `category`, `address`, `city`, `state`, `country`, `contactPerson`, `phone`, `email`, `googleMapsLink`, `notes`, `createdAt` |
| People | `id`, `fullName`, `nickname`, `mobileNumber`, `email`, `gender`, `relationship`, `placeId`, `address`, `notes`, `rsvpStatus`, `invitationSent`, `createdAt` |
| Expenses | `id`, `title`, `category`, `amount`, `date`, `paidTo`, `paymentMethod`, `placeId`, `paymentStatus`, `notes`, `createdAt` |
| Checklist | `id`, `task`, `category`, `dueDate`, `completed` |

Boolean fields accept `TRUE` or `FALSE`; `amount` and `totalBudget` must be numbers. Google Sheets is the source for every listed wedding record; if it cannot be read, the app shows empty lists rather than demo data.

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
# wedding
