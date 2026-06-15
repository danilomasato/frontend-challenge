import * as utils from "../utils";

export const getCharacterData = (id) =>  utils.GetAPI(!id ? 'Anuncios?populate=*' : `Anuncios/?filters[id][$eq]=${id}&populate=*`);
export const getArticles = (id) => utils.GetAPI( id ? 'Anuncios' : `Anuncios?populate=*`);
export const getAuthors = (id) => utils.GetAPI( id ? 'Anuncios' : `Anuncios?populate=*`);
export const getImoveisCache = (id) => utils.GetNewAPI("https://tudosobreap.com.br/Articles.json");







