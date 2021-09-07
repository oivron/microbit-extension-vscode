import { EOL } from 'os';

/**
 * Modifies the current error, adding another error message, without changing the stack trace.
 *
 * @param {Error} err - The original error object.
 * @param {string} newMessage - The new message to be added.
 */
export const addErrMsg = (err: Error, newMessage: string): void => {
    err.message = `${newMessage}${EOL}${err.message}`;
}