export const padStart = (str: any, num: number, fill = ' ') => str.toString().padStart(num, fill);

export const padEnd = (str: any, num: number, fill = ' ') => str.toString().padEnd(num, fill);

export const startsWith = (str: string, char: string) => str.startsWith(char);

export const endsWith = (str: string, char: string) => str.endsWith(char);

export const capitalize = (str: string, num = 1) => `${str.slice(num).toUpperCase()}${str.slice(0, num)}`;

export const normalize = (str: string) => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

export const stringify = (str: string) => normalize(str).toLowerCase().replace(/ /g, '-');

export const color = (str: string) => str.slice(4, -1).split(', ').map(Number);

export const hsl = (str: string) => str.slice(4, -1).split(', ').map(s => parseInt(s));
