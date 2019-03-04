import fs from 'fs';

export default function fileLoad(src: string): Promise<string> {
  return new Promise((resolve, reject) => {
    fs.readFile(src, (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(data.toString());
    });
  });
}
