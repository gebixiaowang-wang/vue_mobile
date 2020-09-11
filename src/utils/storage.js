export const setItem = (key, val) => {
  if (typeof val === 'object') {
    val = JSON.stringify(val)
  }
  window.localStorage.setItem(key, val)
}
export const getItem = (key) => {
  try {
    return JSON.parse(window.localStorage.getItem(key))
  } catch (err) {
    return window.localStorage.getItem(key)
  }
}
export const removeItem = (key) => {
  window.localStorage.removeItem(key)
}
