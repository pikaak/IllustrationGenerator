import fs from "fs";
import path from "path";
import crypto from "crypto";

const IMAGES_DIR = path.join(process.cwd(), "generated_images");

// Ensure images directory exists
if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
}

// Save base64 image data to file and return the file path
export function saveImageToFile(cardName: string, base64Data: string): string {
  // Extract the actual base64 data (remove data URL prefix)
  const base64Match = base64Data.match(/^data:image\/(\w+);base64,(.+)$/);
  if (!base64Match) {
    throw new Error("Invalid base64 image data");
  }

  const extension = base64Match[1];
  const imageData = base64Match[2];

  // Generate hash for unique filename
  const hash = crypto.createHash("md5").update(imageData).digest("hex").substring(0, 8);
  
  // Create filename following the pattern: The_[CardName]_tarot_card_[hash].png
  const sanitizedName = cardName.replace(/\s+/g, "_");
  const filename = `The_${sanitizedName}_tarot_card_${hash}.${extension}`;
  const filepath = path.join(IMAGES_DIR, filename);

  // Write image to file
  const buffer = Buffer.from(imageData, "base64");
  fs.writeFileSync(filepath, buffer);

  // Return relative URL path for serving
  return `/images/${filename}`;
}

// Get image file path from URL
export function getImageFilePath(imageUrl: string): string {
  const filename = imageUrl.split("/").pop();
  if (!filename) {
    throw new Error("Invalid image URL");
  }
  return path.join(IMAGES_DIR, filename);
}

// Check if image file exists
export function imageExists(imageUrl: string): boolean {
  try {
    const filepath = getImageFilePath(imageUrl);
    return fs.existsSync(filepath);
  } catch {
    return false;
  }
}

// Get all generated image files
export function getAllImageFiles(): string[] {
  if (!fs.existsSync(IMAGES_DIR)) {
    return [];
  }
  
  return fs.readdirSync(IMAGES_DIR)
    .filter(file => /\.(png|jpg|jpeg|webp)$/i.test(file))
    .map(file => `/images/${file}`);
}
