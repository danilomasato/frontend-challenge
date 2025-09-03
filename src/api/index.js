import * as utils from "../utils";

export const getCharacterData = (id) => utils.GetAPI(!id ? 'character' : 'character?page=' + id);
export const getArticles = (id) => utils.GetAPI( id ? 'Articles' : 'Articles?populate=fotos&populate=autor');

