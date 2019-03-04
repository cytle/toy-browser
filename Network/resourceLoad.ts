import url from 'url';
import httpLoad from './httpLoad';
import fileLoad from './fileLoad';

export default function resourceLoad(path: string, refererUrl: string = ''): Promise<string> {
  const urlString = url.resolve(refererUrl, path);
  return urlString.startsWith('http')
    ? httpLoad(urlString)
    : fileLoad(urlString);
}
