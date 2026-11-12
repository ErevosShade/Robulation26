import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import SmoothScroll from "@/components/SmoothScroll";
import SecretSignature from "@/components/SecretSignature";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://robolution.bitmesra.ac.in"),
  title: {
    default: "ROBOLUTION • Team Pratyumnis • BIT Mesra",
    template: "%s // ROBOLUTION • BIT Mesra",
  },
  description: "Official Robotics Society of Birla Institute of Technology, Mesra. Est. 2001. ABU Robocon, Autonomous Systems, and RoboSaga Annual Techno-Hardware Fest.",
  applicationName: "Robolution Mission Control",
  authors: [{ name: "Team Pratyumnis", url: "https://robolution.bitmesra.ac.in" }],
  keywords: [
    "Robolution",
    "Team Pratyumnis",
    "BIT Mesra",
    "Robotics",
    "ABU Robocon",
    "Mars Rover",
    "Mechatronics",
    "RoboSaga",
  ],
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/robolution-icon-bright.png", sizes: "64x64", type: "image/png" },
      { url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://robolution.bitmesra.ac.in",
    siteName: "ROBOLUTION // BIT Mesra",
    title: "ROBOLUTION • Team Pratyumnis • BIT Mesra",
    description: "Official Mechatronics & Autonomous Robotics Society of Birla Institute of Technology, Mesra. Est. 2001. ABU Robocon, Autonomous Rovers, and RoboSaga.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ROBOLUTION • Team Pratyumnis • BIT Mesra",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ROBOLUTION • Team Pratyumnis • BIT Mesra",
    description: "Official Mechatronics & Autonomous Robotics Society of Birla Institute of Technology, Mesra. Est. 2001.",
    images: ["/og-image.png"],
    creator: "@RobolutionBITM",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", inter.variable)}
    >
      <body className="min-h-full flex flex-col">
        <SmoothScroll>{children}</SmoothScroll>
        <SecretSignature />
      </body>
    </html>
  );
}
