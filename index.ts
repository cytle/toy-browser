
import resourceLoad from './Network/resourceLoad';
import parseHTML from './HTMLParser/parseHTML';

export default async function browse(url: string) {
  const refererUrl = url;
  const document = parseHTML(await resourceLoad(url));

  document.childNodes.forEach((node) => {
    node.childNodes.forEach()
  });
}
