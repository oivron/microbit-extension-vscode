import axios from 'axios';
import { addErrMsg } from './error';
import { DownloadOptions } from './types';

/**
 * Builds the URL that will be used to download the source code.
 *
 * @param {string} [url] - The url of the GitHub repository (add #<branch> at the end to specify the branch).
 * @param {DownloadOptions} [options] - The options for the download command.
 * @returns {Promise<string>} Returns a valid URL.
 */
export const buildUrl = async (url?: string, options?: DownloadOptions): Promise<string> => {
    const modifiedUrl = await buildWithString(url) || await buildWithOptions(options);

    if (!isValid(modifiedUrl))
        throw new Error(`the URL was modified to '${modifiedUrl}', but it is not valid.`);

    return modifiedUrl;
}

const buildWithString = async (url?: string): Promise<string> => {

    if (!url) {
        return '';
    }

    url = url.toLowerCase();

    if (!url.includes('github.com')) {
        throw new Error(`invalid URL. The given URL '${url}' doesn't have the github.com domain.`);
    }

    url = url.replace('http://', 'https://');
    url = url.replace('git@github.com:', 'https://github.com/');

    if (url.startsWith('github.com')) {
        url = url.replace('github.com', 'https://github.com');
    }

    url = url.replace('https://github.com', 'https://codeload.github.com');

    let branch;
    [url, branch] = url.split('#');

    branch = branch || await getDefaultBranch(url);

    if (url.endsWith('.git')) {
        url = url.slice(0, -4);
    }

    return `${url}/zip/${branch}`;
}

const buildWithOptions = async (options?: DownloadOptions): Promise<string> => {

    if (!options) {
        throw new Error('invalid input parameters. You need to inform the URL with a string or using the options object.');
    }

    if (!options.username) {
        throw new Error('invalid username.');
    }

    if (!options.repo) {
        throw new Error('invalid repository.');
    }

    const url = `https://codeload.github.com/${options.username}/${options.repo}`;

    const branch = options.branch || await getDefaultBranch(url);
    return `${url}/zip/${branch}`;
}

const getDefaultBranch = async (url: string): Promise<string> => {

    url = url.replace('://codeload.github.com', '://api.github.com/repos');

    const headers = {
        Accept: 'application/vnd.github.v3+json'
    }

    try {
        const response = await axios.get(url, { headers });
        return response.data.default_branch;
    } catch (err) {
        addErrMsg(err, 'error trying to get the default branch. Try again passing the branch name in this format: https://github.com/<user>/<repo>#<branch>');
        throw err;
    }
}

const isValid = (url: string): boolean => {
    // This regex "[^/]*" means "any character, except slash"
    const regex = new RegExp('https://codeload\\.github\\.com/[^/]*/[^/]*/zip/[^/]*');
    return regex.test(url);
}