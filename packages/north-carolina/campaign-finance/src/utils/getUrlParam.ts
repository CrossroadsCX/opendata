import { URL } from 'url'

export const getUrlParam = (url: string, param: string) => {
  const urlObject = new URL(url)
  const { searchParams } = urlObject
  return searchParams.get(param)
}
