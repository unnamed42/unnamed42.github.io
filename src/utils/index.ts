export function classNames(strs: (string | undefined)[]): string;
export function classNames(obj: { [x: string]: boolean; }): string;

export function classNames(obj: Array<string | undefined> | { [x: string]: boolean }): string {
  if (Array.isArray(obj)) {
    return obj.filter(e => e).join(' ');
  }
  return Object.entries(obj).filter(([_, v]) => v).map(entry => entry[0]).join(' ');
}
