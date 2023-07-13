/**
 * @function
 * @param {string} name
 * @param {*} value
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties
 * @example
 * setDomProperty('--custom-variable', '#ffffff');
 */
export function setDomProperty(name, value) {
    document.documentElement.style.setProperty(`${name}`, value);
}
