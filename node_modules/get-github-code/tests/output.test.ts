import * as path from 'path';
import { DownloadOptions } from '../lib/types';
import { getFilename } from '../lib/output';

describe('test if the output is set correctly', () => {

    const url = 'https://codeload.github.com/username/repo/zip/branch';

    it('checks if the filename is returned correctly', async () => {

        // local without zip
        expect(await getFilename(url)).toBe('repo-branch');
        expect(await getFilename(url, { zip: false } as DownloadOptions)).toBe('repo-branch');

        // local zip
        expect(await getFilename(url, { zip: true } as DownloadOptions)).toBe('repo-branch.zip');

        // directory
        const dirWithoutZip = await getFilename(url, { output: process.cwd() } as DownloadOptions);
        const dirWithZip = await getFilename(url, { output: process.cwd(), zip: true } as DownloadOptions);
        expect(dirWithoutZip).toBe(process.cwd());
        expect(dirWithZip).toBe(`${process.cwd()}.zip`);

        // filename was given
        const filename = path.resolve(process.cwd(), 'repo-branch.zip');
        expect(await getFilename(url, { output: filename } as DownloadOptions)).toBe(filename);
        expect(await getFilename(url, { output: filename, zip: false } as DownloadOptions)).toBe(filename); // zip option should be ignored
    });

    it('checks if the output option is valid', async () => {
        expect(getFilename(url, { output: './file.txt' } as DownloadOptions)).rejects.toBeTruthy();
    })
});