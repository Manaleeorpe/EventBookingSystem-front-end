# Event Booking System Front-End

A modern web client for browsing and discovering events, with Google-based authentication and category/search filtering.

## Features

- Google login flow via backend OAuth endpoint.
- Event discovery with featured events and regular event listings.
- Category-based filtering for featured events.
- Search support for finding events by keyword.
- Responsive UI built with utility-first styling.
- API client layer with query-parameter based requests.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript + React 19
- **Styling:** Tailwind CSS
- **Icons/UI:** Heroicons, Lucide React
- **Image/CDN tooling:** next-cloudinary
- **Utilities:** clsx, tailwind-merge
- **Linting:** ESLint

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### Run in Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build for Production

```bash
npm run build
npm run start
```
