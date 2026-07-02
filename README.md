# Pa'lante Con El Saber Website

Official repository for the Pa'lante Con El Saber platform. Developed as part of the 2026 Latin American Citizen Action Laboratory (LLAC), this tool provides vocational orientation and academic guidance to 9th-grade students in Panama to help them make informed decisions about their high school tracks.

## Features

- Next.js 16 app router
- Tailwind CSS v4 styling
- Radix UI + custom UI components
- Contact form powered by EmailJS
- Responsive layout for desktop and mobile
- Simple page sections: hero, about, alliances, contact, footer

## Project structure

- `app/` - Next.js app router pages and layout
- `components/` - reusable UI and page sections
- `components/ui/` - design system components
- `constants/` - shared prompt/constants data
- `hooks/` - custom React hooks
- `lib/` - utility helpers
- `public/` - static assets and images
- `styles/` - global styles

## Getting started

### Requirements

- Node.js 20+ recommended
- `pnpm` installed globally

### Install dependencies

```bash
pnpm install
```

### Environment variables

Create a `.env.local` file with the following variables:

```bash
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
```

### Run locally

```bash
pnpm dev
```

Open `http://localhost:3000` to view the site.

## Build

```bash
pnpm build
```

## Start

```bash
pnpm start
```

## Lint

```bash
pnpm lint
```

## Notes

- `next.config.mjs` uses `typescript.ignoreBuildErrors: true` and `images.unoptimized: true`.
- The contact form is in `components/contact-section.tsx`.

## License

This project is licensed under the **MIT License**. 

You are free to use, copy, modify, and distribute this software for any purpose, including commercial applications, provided that the original copyright notice and this permission notice are included in all copies or substantial portions of the software.

See the [LICENSE](LICENSE) file for the full text.