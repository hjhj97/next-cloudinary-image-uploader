import { MAX_FILE_SIZE } from '@/app/constants/size';
import cloudinary from '@/lib/cloudinary';
import type { UploadApiResponse } from 'cloudinary';

export async function POST(request: Request) {
  try {
    const uploadsFolder = process.env.CLOUDINARY_UPLOADS_FOLDER;
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const filename = formData.get('filename') as string;

    if (!file) {
      return Response.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const fileBuffer = await file.arrayBuffer();
    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: 'image',
            folder: uploadsFolder,
            public_id: filename.split('.')[0],
            allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
            chunk_size: MAX_FILE_SIZE,
          },
          (error, result) => {
            if (error || !result) reject(error);
            else resolve(result);
          }
        )
        .end(Buffer.from(fileBuffer));
    });

    return Response.json({ secure_url: result.secure_url });
  } catch (error) {
    console.error('Error uploading file:', error);
    return Response.json({ error: 'Error uploading file' }, { status: 500 });
  }
}
