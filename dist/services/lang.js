import { EmbedBuilder, resolveColor } from 'discord.js';
import { Linguini, TypeMappers, Utils } from 'linguini';
import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Language } from '../models/enum-helpers/index.js';
export class Lang {
    static getEmbed(location, langCode, variables) {
        return (this.linguini.get(location, langCode, this.embedTm, variables) ??
            this.linguini.get(location, Language.Default, this.embedTm, variables));
    }
    static getRegex(location, langCode) {
        return (this.linguini.get(location, langCode, TypeMappers.RegExp) ??
            this.linguini.get(location, Language.Default, TypeMappers.RegExp));
    }
    static getRef(location, langCode, variables) {
        return (this.linguini.getRef(location, langCode, variables) ??
            this.linguini.getRef(location, Language.Default, variables));
    }
    static getRefLocalizationMap(location, variables) {
        let obj = {};
        for (let langCode of Language.Enabled) {
            obj[langCode] = this.getRef(location, langCode, variables);
        }
        return obj;
    }
    static getCom(location, variables) {
        return this.linguini.getCom(location, variables);
    }
}
Lang.linguini = new Linguini(path.resolve(dirname(fileURLToPath(import.meta.url)), '../../lang'), 'lang');
Lang.embedTm = (jsonValue) => {
    return new EmbedBuilder({
        author: jsonValue.author,
        title: Utils.join(jsonValue.title, '\n'),
        url: jsonValue.url,
        thumbnail: {
            url: jsonValue.thumbnail,
        },
        description: Utils.join(jsonValue.description, '\n'),
        fields: jsonValue.fields?.map(field => ({
            name: Utils.join(field.name, '\n'),
            value: Utils.join(field.value, '\n'),
            inline: field.inline ? field.inline : false,
        })),
        image: {
            url: jsonValue.image,
        },
        footer: {
            text: Utils.join(jsonValue.footer?.text, '\n'),
            iconURL: jsonValue.footer?.icon,
        },
        timestamp: jsonValue.timestamp ? Date.now() : undefined,
        color: resolveColor(jsonValue.color ?? Lang.getCom('colors.default')),
    });
};
//# sourceMappingURL=lang.js.map