import axios from 'axios';
import { addErrMsg } from './lib/error';
import { getFilename } from './lib/output';
import { DownloadOptions } from './lib/types';
import { buildUrl } from './lib/url';
import { writeOutput } from './lib/write';

export { DownloadOptions };

type Download = {
    (url: string, options?: DownloadOptions): Promise<void>;
    (options: DownloadOptions): Promise<void>;
}

/** 
 * Downloads a GitHub project source code, but only the code without the .git data.
 * 
 * @param {string} [url] - The url of the GitHub repository (add #<branch> at the end to specify the branch).
 * @param {DownloadOptions} [options] - The options for the download command.
 * @returns {Promise<void>} Returns nothing. The files will be saved in the disk or the function will throw an error.
 */
const download: Download = async (url?: any, options?: DownloadOptions): Promise<void> => {

    if (typeof url === 'object') { // handle the function overload
        options = url as DownloadOptions;
        url = undefined;
    }

    url = await buildUrl(url, options);
    const filename = await getFilename(url, options);

    let response;
    try {
        response = await axios.get(url, { responseType: 'stream' });
    } catch (err) {
        addErrMsg(err, 'could not download the source code.');
        throw err;
    }

    await writeOutput(response.data, filename);
}

export { download };