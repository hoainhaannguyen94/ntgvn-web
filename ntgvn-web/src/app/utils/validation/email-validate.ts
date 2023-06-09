export const validEmailPattern = /^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gim;

export function isEmailValid(email = '') {
    let isValid = true;
    if (!email.match(validEmailPattern)) {
        isValid = false;
    }
    return isValid;
}

export function isEmailsValid(emails: string[] = []) {
    let isValid = true;
    for (let i = 0; i < emails.length; i++) {
        const email = emails[i];
        if (!email.match(validEmailPattern)) {
            isValid = false;
            break;
        }
    }
    return isValid;
}
