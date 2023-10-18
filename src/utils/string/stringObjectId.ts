export function stringObjectId(): string {
  const timestamp: string = ((new Date().getTime() / 1000) | 0).toString(16);
  return timestamp + 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, () => ((Math.random() * 16) | 0).toString(16)).toLowerCase();
}
