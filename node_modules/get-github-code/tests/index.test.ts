import * as fs from 'fs';
import * as path from 'path';
import { exist, rmdirRecursive } from '../lib/fs-utils';
import { download, DownloadOptions } from '../index';

describe('test this package', () => {

    const url = 'https://github.com/diegozanon/get-github-code';
    const timeout = 15 * 1000; // 15 seconds

    it('downloads unzipped', async () => {
        await download(url);
        await expect(exist(path.resolve('./get-github-code-main/README.md'))).resolves.toBeTruthy();
    }, timeout);

    it('downloads another branch and is a zip file', async () => {
        await download(url + '#develop', { zip: true } as DownloadOptions);
        await expect(exist(path.resolve('./get-github-code-develop.zip'))).resolves.toBeTruthy();
    }, timeout);

    it('downloads to a given directory', async () => {
        await download(url, { output: './download' } as DownloadOptions);
        await expect(exist(path.resolve('./download/README.md'))).resolves.toBeTruthy();
    }, timeout);

    it('downloads using a given filename', async () => {
        await download(url, { output: './my-download.zip' } as DownloadOptions);
        await expect(exist(path.resolve('./my-download.zip'))).resolves.toBeTruthy();
    }, timeout);
});

afterAll(async () => {
    // clear downloaded files
    await rmdirRecursive(path.resolve('./get-github-code-main'));
    await fs.promises.unlink(path.resolve('./get-github-code-develop.zip'));
    await rmdirRecursive(path.resolve('./download'));
    await fs.promises.unlink(path.resolve('./my-download.zip'));
});