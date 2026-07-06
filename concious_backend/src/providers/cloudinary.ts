import { v2 as cloudinary } from "cloudinary";
import {
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_CLOUD_NAME,
} from "../config.js";

export interface CloudinaryPdfUploadResult {
  publicId: string;
  secureUrl: string;
  resourceType: string;
  format?: string;
  bytes?: number;
  originalFilename: string;
}

export function isCloudinaryConfigured() {
  return Boolean(
    CLOUDINARY_CLOUD_NAME && CLOUDINARY_API_KEY && CLOUDINARY_API_SECRET
  );
}

function configureCloudinary() {
  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
    secure: true,
  });
}

export async function uploadPdfToCloudinary(
  buffer: Buffer,
  originalFilename: string
): Promise<CloudinaryPdfUploadResult> {
  if (!isCloudinaryConfigured()) {
    throw new Error("Cloudinary is not configured");
  }

  configureCloudinary();

  return new Promise((resolve, reject) => {
    const upload = cloudinary.uploader.upload_stream(
      {
        folder: "concious/pdfs",
        resource_type: "raw",
        format: "pdf",
      },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error("Cloudinary upload failed"));
          return;
        }

        const uploaded: CloudinaryPdfUploadResult = {
          publicId: result.public_id,
          secureUrl: result.secure_url,
          resourceType: result.resource_type,
          originalFilename,
        };

        if (result.format) {
          uploaded.format = result.format;
        }
        if (typeof result.bytes === "number") {
          uploaded.bytes = result.bytes;
        }

        resolve(uploaded);
      }
    );

    upload.end(buffer);
  });
}

export async function deleteCloudinaryPdf(publicId: string) {
  if (!isCloudinaryConfigured()) {
    return;
  }

  configureCloudinary();
  await cloudinary.uploader.destroy(publicId, { resource_type: "raw" });
}
