import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Request } from 'express';

export const multerConfig = MulterModule.registerAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => {
    return {
      storage: diskStorage({
        destination: configService.get('UPLOAD_DEST', './uploads'),
        filename: (req: Request, file: Express.Multer.File, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          callback(null, file.fieldname + '-' + uniqueSuffix + extname(file.originalname));
        },
      }),
      fileFilter: (req: Request, file: Express.Multer.File, callback) => {
        // Allow only images and PDFs
        const allowedTypes = /jpeg|jpg|png|gif|pdf/;
        const extName = allowedTypes.test(extname(file.originalname).toLowerCase());
        const mimeType = allowedTypes.test(file.mimetype);

        if (mimeType && extName) {
          return callback(null, true);
        } else {
          callback(new Error('Only images and PDF files are allowed'));
        }
      },
      limits: {
        fileSize: parseInt(configService.get('MAX_FILE_SIZE', '5242880')), // 5MB default
      },
    };
  },
});

export function validateFile(file?: Express.Multer.File): string | null {
  if (!file) return null;
  
  const allowedTypes = /jpeg|jpg|png|gif|pdf/;
  const extName = allowedTypes.test(extname(file.originalname).toLowerCase());
  const mimeType = allowedTypes.test(file.mimetype);

  if (!mimeType || !extName) {
    throw new Error('Only images and PDF files are allowed');
  }

  return file.filename;
}