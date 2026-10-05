# Robulation 2026

Welcome to the **Robulation 2026** project repository.

---

## 📁 Project Structure

```text
Robulation26/
├── frontend/               # Next.js frontend application
│   ├── src/                # Application source code (App Router)
│   │   └── app/            # Next.js pages, layouts, and styles
│   ├── public/             # Static assets
│   ├── package.json        # Frontend scripts and dependencies
│   └── tsconfig.json       # TypeScript configuration
├── .gitignore              # Git ignore rules for the entire repository
└── README.md               # Root documentation
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v20+ recommended)
- [pnpm](https://pnpm.io/) (v9+ / v12+)

```bash
# Enable pnpm via corepack if not already installed
corepack enable
corepack prepare pnpm@latest --activate
```

---

### Installation

Navigate to the frontend directory and install dependencies:

```bash
cd frontend
pnpm install
```

---

### Running the Development Server

Start the local Next.js development server:

```bash
cd frontend
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

---

## 🛠 Available Scripts (in `frontend/`)

| Script | Description |
| :--- | :--- |
| `pnpm run dev` | Starts the Next.js development server with Turbopack |
| `pnpm run build` | Builds the application for production |
| `pnpm run start` | Runs the built production server |
| `pnpm run lint` | Runs ESLint to check for code issues |
| `pnpm run test` | Runs the test suite |

---

## 🧰 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Package Manager**: [pnpm](https://pnpm.io/)
