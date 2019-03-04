import http from 'http';

export default function httpLoad(urlString:string): Promise<string> {
  return new Promise((resolve, reject) => {
    const req = http.get(urlString, (res) => {
    // Do stuff with response
      res.setEncoding('utf8');
      let rawData = '';
      res.on('data', (chunk) => { rawData += chunk; });
      res.on('end', () => {
        try {
          resolve(rawData);
        } catch (e) {
          reject(e);
        }
      });
    });
    req.on('error', (e) => {
      reject(e);
    });
  });
}
