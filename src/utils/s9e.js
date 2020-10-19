/* eslint-disable */
const tags = {
  topic: text => {
      const regexp = /<span\s*id="topic"\s*value="(?<value>\w+)"\s*>(?<string>[^<]+)<\/span>/igum;
      return text && text.replace(regexp, match => {
          return match.replace(regexp, (content, value, text) => {
              const href = `/pages/topic/content?id=${value}`;
              return `<a href="${href}" class="content-topic">${text}</a> `;
          });
      });
  },
  usermention: text => {
      const regexp = /<span\s*id="member"\s*value="(?<value>\w+)"\s*>(?<string>[^<]+)<\/span>/igum;
      return text && text.replace(regexp, match => {
          return match.replace(regexp, (content, value, text) => {
              const href = `/pages/profile/index?userId=${value}`;
              return `<a href="${href}" class="content-member">${text}</a> `;
          });
      });
  },
  attachment: (text, component) => {
    return text && text.replace(/\[attach\](.*?)\[\/attach\]/g, (str, id) => {
      const attach = component.$store.getters['jv/get'](`attachments/${id}`);
      if(attach.url) {
        str = `<a href="${attach.url}" class="content-attachment">${attach.attachment}</a>`;
      }
      return str;
    });
  }
};

function parse(text, component) {
    if(!text) return;
    for(const tag in tags) {
        text = tags[tag](text, component);
    }
    return text;
}

export default { parse };
