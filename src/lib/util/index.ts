export const path = (...paths: string[]) => `/${paths.join('/')}`;

export const wait = (ms: number) => new Promise((res) => setTimeout(res, ms));