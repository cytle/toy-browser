import parseHTML from './HTMLParser/parseHTML';
import attach from './Attachment/attach';
import parseCSS from './CSSParser/parseCSS';
import resourceLoad from './Network/resourceLoad';

const BASE_STYLE_RESOURCE_PROMISE = loadAndParseCSS('./html.css', __dirname);

async function loadAndParseCSS(url: string, refererUrl: string) {
  return parseCSS(await resourceLoad(url, refererUrl));
}
export default async function browse(url: string) {
  // const refererUrl = url;

  console.log('parseHTML');
  // parseHTML
  const document = parseHTML(await resourceLoad(url));

  console.log('load css style sheet');
  // load css style sheet

  const styleSheets = await Promise.all(
    [BASE_STYLE_RESOURCE_PROMISE].concat(
      document.styleSheetNodes
      .filter(el => el.tagName === 'LINK' && el.href)
      .map(el => loadAndParseCSS(el.href, url)),
    ),
  );

  console.log('attach');
  // attach
  const renderTree = attach(document, styleSheets);
  console.log(renderTree);
}
