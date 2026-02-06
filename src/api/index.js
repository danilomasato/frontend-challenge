import * as utils from "../utils";

export const getCharacterData = (id) => utils.GetAPI(!id ? 'Articles' : `Articles?pagination[page]=${id}&pagination[pageSize]=6&populate=fotos&populate=autor`);
export const getArticles = (id) => utils.GetAPI( id ? 'Articles' : `Articles?populate=*`);
export const getAuthors = (id) => utils.GetAPI( id ? 'Authors' : `Authors?populate=*`);
export const getImoveisCache = (id) => utils.GetNewAPI("https://tudosobreap.com.br/Articles.json");







