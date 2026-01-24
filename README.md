# Gaadiwala Next.js Frontend

A modern, clean frontend for the Gaadiwala used vehicle marketplace platform, built with Next.js 14 and inspired by CarDekho's minimal design.

## 🎨 Design

- **Clean & Minimal**: White background with professional aesthetics
- **Color Scheme**: Blue (#2563eb) primary, Orange (#f97316) secondary
- **Responsive**: Mobile-first design
- **Modern UI**: Card-based layouts with subtle shadows and smooth transitions

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Backend server running on http://localhost:5000

### Installation

1. **Install dependencies**:
```bash
npm install
```

2. **Start development server**:
```bash
npm run dev
```

3. **Open in browser**:
```
http://localhost:3000
```

## 📱 Pages

### User Pages
- **Homepage** (`/`) - Hero section, featured vehicles, features
- **Browse Vehicles** (`/vehicles`) - Vehicle listing with filters
- **Vehicle Detail** (`/vehicles/[id]`) - Detailed view with booking form

### Admin Pages
- **Login** (`/admin/login`) - Admin authentication
- **Dashboard** (`/admin/dashboard`) - Admin panel (use old HTML version for full features)

## 🔧 Configuration

### Environment Variables
Create `.env.local` file:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **HTTP Client**: Axios
- **Icons**: React Icons

## 📂 Project Structure

```
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Homepage
│   ├── vehicles/          # Vehicle pages
│   └── admin/             # Admin pages
├── components/            # React components
│   ├── layout/           # Layout components
│   └── ui/               # UI components
├── lib/                   # Utilities
│   ├── api.ts            # API client
│   └── types.ts          # TypeScript types
└── public/               # Static assets
```

## 🎯 Features

- ✅ Clean, minimal design
- ✅ Responsive layout
- ✅ Advanced filtering
- ✅ Image galleries
- ✅ Booking forms
- ✅ Admin authentication
- ✅ TypeScript support
- ✅ SEO optimized

## 🔗 Backend Integration

The frontend connects to the backend API running on `http://localhost:5000`.

Make sure the backend server is running before starting the frontend.


## 🚧 Note

For full admin panel functionality (vehicle CRUD, booking management), use the original HTML/JS admin panel located in the `frontend/admin/` directory until the Next.js admin panel is fully implemented.

## 📄 License

Open source - Educational purposes

---

Made with ❤️ for vehicle enthusiasts
