import * as utils from "../utils";

export const getCharacterData = (id) => utils.GetAPI(!id ? 'character' : 'character?page=' + id);