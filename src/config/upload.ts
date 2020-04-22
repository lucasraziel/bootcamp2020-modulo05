import multer from 'multer';
import { resolve } from 'path';
import crypto from 'crypto';

const folder = resolve(__dirname, '..', '..', 'tmp');

export default {
  directory: folder,
  storage: multer.diskStorage({
    destination: folder,
    filename: (request, file, callback) => {
      const fileHash = crypto.randomBytes(10).toString('HEX');
      const fileName = `${fileHash}-${file.originalname}`;

      return callback(null, fileName);
    },
  }),
};
