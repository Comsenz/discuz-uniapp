import HtmlToJson from './html2json';

const DEFAULT_IMAGE_PROP = {
  mode: 'aspectFit',
  padding: 0,
  lazyLoad: false,
  domain: '',
};

const DEFAULT_CHARS_HANDLER = node => {
  node = node;
};
const DEFAULT_START_HANDLER = node => {
  node.attr.class = null;
  node.attr.style = null;
};
const DEFAULT_END_HANDLER = node => node;


export default function html2JsonHelper(_this, content, noData = '', startHandler = null, endHandler = null, charsHandler = null) {
  let parseData = content || noData;
  let customHandler = {
    start: startHandler || DEFAULT_START_HANDLER,
    end: endHandler || DEFAULT_END_HANDLER,
    chars: charsHandler || DEFAULT_CHARS_HANDLER,
  };

  const results = HtmlToJson(parseData, customHandler, DEFAULT_IMAGE_PROP, _this);
  const imageUrls = results.imageUrls;

  const nodes = [];
  results.nodes.forEach(item => {
    if (item.node) {
      nodes.push(item);
    }
  });

  return {
      nodes,
      imageUrls
  }
}
