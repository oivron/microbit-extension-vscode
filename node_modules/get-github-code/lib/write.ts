import * as decompress from 'decompress';
import * as fs from 'fs';
import * as path from 'path';
import { addErrMsg } from './error';
import { exist, moveFilesUp } from './fs-utils';

/**
 * Writes the output to disk
 *
 * @param {any} data - The result of the Ajax request.
 * @param {string} filename - The filename.
 * @returns {Promise<void>} Returns nothing if success, but throws if it fails.
 */
export const writeOutput = async (data: any, filename: string): Promise<void> => {

    try {

        filename = path.resolve('./', filename);

        await createDirIfNecessary(filename);

        let needsUnzip = false;
        if (!filename.endsWith('.zip')) {
            filename += '/file.zip'; // temporary file
            needsUnzip = true;
        }

        const writer = fs.createWriteStream(filename);
        data.pipe(writer);

        await new Promise((resolve, reject) => {
            writer.on('finish', async () => {

                try {
                    if (needsUnzip) {
                        const parentDir = path.dirname(filename);
                        await decompress(filename, parentDir);
                        await fs.promises.unlink(filename);

                        // the unzip will create a new dir and we need to move files from this dir to the parent dir
                        await moveFilesUp(parentDir);
                    }
                } catch (err) {
                    reject(err);
                };

                resolve();
            });

            writer.on('error', reject);
        });
    } catch (err) {
        addErrMsg(err, 'could not write the downloaded files to the local disk.');
        throw err;
    }
}

const createDirIfNecessary = async (filename: string): Promise<void> => {

    if (await exist(filename)) {
        return;
    }

    if (filename.endsWith('.zip')) {
        await fs.promises.mkdir(path.dirname(filename), { recursive: true });
    } else {
        await fs.promises.mkdir(filename, { recursive: true });
    }
}