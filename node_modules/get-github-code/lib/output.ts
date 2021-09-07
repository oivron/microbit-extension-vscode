import * as path from 'path';
import { exist, isDir } from './fs-utils';
import { DownloadOptions } from './types';

/**
 * Gets the filename of the file to save to disk
 *
 * @param {string} [url] - The url of the GitHub repository (add #<branch> at the end to specify the branch).
 * @param {DownloadOptions} [options] - The options for the download command.
 * @returns {string} Returns the filename.
 */
export const getFilename = async (url: string, options?: DownloadOptions): Promise<string> => {

    // url format: https://codeload.github.com/username/repo/zip/branch where branch name may have slashes
    const branch = url.split('/zip/').pop()?.replace(/\//g, '-');
    const repo = url.split('/zip/').shift()?.split('/').pop();

    let filename = `${repo}-${branch}`;

    if (options?.output) {

        const out = path.resolve(options.output);
        filename = out;

        // if it's not a directory, then checks if ends with .zip
        if (await exist(out)) {
            if (!(await isDir(out))) {
                fileMustEndWithZip(filename);
            }
        } else {
            if (path.extname(out)) {
                fileMustEndWithZip(filename);
            }
        }
    }

    if (options?.zip) {
        filename += '.zip'
    }

    return filename;
}

const fileMustEndWithZip = (filename: string): void => {
    if (!filename.endsWith('.zip')) {
        throw new Error('If output is a file, it must end with .zip');
    }
}