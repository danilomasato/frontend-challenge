import * as utils from "../utils";

export const getCharacterData = (id) => utils.GetAPI(!id ? 'Articles' : `Articles?pagination[page]=${id}&pagination[pageSize]=6&populate=fotos&populate=autor`);
export const getArticles = (id) => utils.GetAPI( id ? 'Articles' : `Articles?pagination[page]=1&pagination[pageSize]=6&populate=fotos&populate=autor`);
export const getAuthors = (id) => utils.GetAPI( id ? 'Authors' : `Authors?populate=*`);





