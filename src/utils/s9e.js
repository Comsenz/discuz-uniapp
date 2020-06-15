/* eslint-disable */
import { DISCUZ_REQUEST_HOST } from '@/common/const';

const tags = {
    topic: text => {
        const regexp = /<span\s*id="(?<id>[^"]+)"\s*value="(?<value>\w+)"\s*>(?<string>[^<]+)<\/span>/igum;
        return text.replace(regexp, match => {
            return match.replace(regexp, (content, id, value, text) => {
                const href = `/pages/topic/content?id=${value}`;
                return `<a href="${href}" class="content-${id}">${text}</a>`;
            });
        });
    },
    usermention: text => {
        const regexp = /<span\s*id="(?<id>[^"]+)"\s*value="(?<value>\w+)"\s*>(?<string>[^<]+)<\/span>/igum;
        return text.replace(regexp, match => {
            return match.replace(regexp, (content, id, value, text) => {
                const href = `/pages/profile/index?userId=${value}`;
                return `<a href="${href}" class="content-${id}">${text}</a>`;
            });
        });
    }
};

function parse(text) {
    for(const tag in tags) {
        text = tags[tag](text); 
    }
    
    return text;
}

export default { parse };