export const createArrayString = (input: string[]) => {
  return input.reduce((prev, current, index) => {
    if (index === 0) {
      return `'${current}'`
    } else {
      return `${prev},'${current}'`
    }
  }, '')
}
