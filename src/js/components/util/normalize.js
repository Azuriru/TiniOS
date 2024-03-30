const normalize = string => string.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

export const stringify = string => normalize(string).toLowerCase().replace(/ /g, '-');

export const color = string => string.slice(4, -1).split(', ').map(Number);

export const hsl = string => string.slice(4, -1).split(', ').map(s => parseInt(s));

export default normalize;