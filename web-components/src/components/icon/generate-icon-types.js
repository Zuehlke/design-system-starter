import * as fs from 'fs';

const icons = fs.readdirSync(new URL('../../assets/icons/', import.meta.url)).map(p => p.replace('.svg', ''));
const content = `export const ICONS = ${JSON.stringify(icons)}  as const;
export type Icons = typeof ICONS[number];`;

fs.writeFileSync(new URL('icons.ts', import.meta.url), content);