export function publicAsset(path: string) {
  if (/^(?:https?:)?\/\//.test(path) || path.startsWith('data:')) return path
  return `/${path.replace(/^\/+/, '')}`
}
