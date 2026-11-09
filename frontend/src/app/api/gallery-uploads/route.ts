import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export type GalleryCategory =
  | 'ALL'
  | 'ROBOSAGA'
  | 'PANTHEON'
  | 'ROBOCON'
  | 'ROBOWARS'
  | 'WORKSHOPS'
  | 'ACHIEVEMENTS'
  | 'PROJECTS';

export interface DynamicGalleryPhoto {
  id: string;
  title: string;
  category: GalleryCategory;
  year: string;
  venueOrContext: string;
  image: string;
  description: string;
  aspectClass?: string;
  tags?: string[];
}

export async function GET() {
  try {
    const uploadDir = path.join(process.cwd(), 'public', 'gallery-uploads');

    if (!fs.existsSync(uploadDir)) {
      return NextResponse.json({ photos: [] });
    }

    const files = fs.readdirSync(uploadDir);
    const validImageRegex = /\.(jpe?g|png|webp|avif|gif)$/i;
    const imageFiles = files.filter(f => validImageRegex.test(f));

    const photos: DynamicGalleryPhoto[] = imageFiles.map((file, idx) => {
      const fileNameWithoutExt = file.replace(/\.[^/.]+$/, '');
      // Clean up underscores and hyphens into readable natural text
      const cleanDescription = fileNameWithoutExt.replace(/[-_]+/g, ' ').trim();

      // Detect year if present in filename (e.g. 2024, 2025, 2026)
      const yearMatch = fileNameWithoutExt.match(/(20\d\d)/);
      const year = yearMatch ? yearMatch[1] : '2026';

      // Detect category from filename keywords
      const lower = fileNameWithoutExt.toLowerCase();
      let category: GalleryCategory = 'PROJECTS';

      if (lower.includes('robosaga')) {
        category = 'ROBOSAGA';
      } else if (lower.includes('pantheon')) {
        category = 'PANTHEON';
      } else if (lower.includes('robocon')) {
        category = 'ROBOCON';
      } else if (lower.includes('robowar')) {
        category = 'ROBOWARS';
      } else if (lower.includes('workshop')) {
        category = 'WORKSHOPS';
      } else if (
        lower.includes('achievement') ||
        lower.includes('podium') ||
        lower.includes('prize') ||
        lower.includes('winner') ||
        lower.includes('trophy')
      ) {
        category = 'ACHIEVEMENTS';
      }

      return {
        id: `custom-upload-${idx}-${file}`,
        title: cleanDescription,
        description: cleanDescription, // The name of the image itself will show the description
        category,
        year,
        venueOrContext: 'Robolution Visual Archives // Uploaded Capture',
        image: `/gallery-uploads/${encodeURIComponent(file)}`,
        aspectClass: 'aspect-[4/3]',
        tags: ['Custom Archive', category, year]
      };
    });

    return NextResponse.json({ photos });
  } catch (error) {
    console.error('Failed to read gallery uploads directory:', error);
    return NextResponse.json({ photos: [] });
  }
}

