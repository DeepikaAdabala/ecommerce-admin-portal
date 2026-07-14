# E-Commerce Admin Portal

A React + TypeScript admin dashboard for managing orders, products, customers, inventory, marketing, analytics, and settings.

## Overview

This application is built with:

- React 18
- TypeScript
- Vite
- Redux Toolkit
- React Router v6
- Bootstrap 5
- Material UI icons
- Axios

The app includes a main dashboard, order and product management pages, customer management, inventory tracking, marketing/content sections, analytics, settings, and notifications.

## Features

- Dashboard with revenue and orders analytics
- Orders list, add, edit, and order details
- Products list, add, and product details
- Customer management page
- Inventory overview
- Marketing and content sections
- Analytics reports and charts
- Settings and account information pages
- Notifications panel
- Responsive admin layout with sidebar and header

## Getting Started

### Install dependencies

```bash
npm install
```

### Run locally

```bash
npm run dev
```

Then open the local Vite URL shown in the terminal.

### Build for production

```bash
npm run build
```

### Preview production build locally

```bash
npm run preview
```

## Scripts

- `npm run dev` - start the development server
- `npm run build` - create a production build
- `npm run preview` - preview the production build locally
- `npm run lint` - run ESLint on the `src` folder
- `npm run format` - format code with Prettier

## Project Structure

- `src/main.tsx` - application entrypoint
- `src/App.tsx` - top-level app component and theme state
- `src/routes/AppRoutes.tsx` - route definitions
- `src/pages/` - page components for dashboard, products, orders, customers, and more
- `src/components/` - UI and layout components
- `src/features/` - Redux slices and feature state
- `src/store/` - Redux store configuration
- `src/styles/global.css` - application styles
- `src/types/` - shared TypeScript types

## Notes

- The app uses Bootstrap utilities and custom CSS for layout.
- Redux Toolkit handles async data fetching and state management.
- React Router provides nested routes inside a main layout.

