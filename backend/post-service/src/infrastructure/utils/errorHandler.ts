import multer from 'multer'

 
export class FileUploadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FileUploadError';
  }
}

export const handleFileUploadError = (error: any) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      throw new FileUploadError('File size too large. Maximum size is 5MB');
    }
    throw new FileUploadError(error.message);
  }
  throw error;
}; 