import axios from 'axios';
import { DownloadOptions } from '../lib/types';
import { buildUrl } from '../lib/url';

jest.mock('axios');
const axiosGet = axios.get as jest.Mock;

describe('test the url validation', () => {

    it('checks if urls are validated correctly', async () => {

        axiosGet.mockResolvedValue({
            data: {
                default_branch: 'main'
            }
        });

        const valids = [
            { url: 'https://github.com/diegozanon/get-github-code' },
            { url: 'https://github.com/diegozanon/get-github-code#main' },
            { url: 'http://github.com/diegozanon/get-github-code' },
            { url: 'github.com/diegozanon/get-github-code' },
            { url: 'git@github.com:diegozanon/get-github-code.git' },
            { url: 'git@github.com:diegozanon/get-github-code.git#main' },
            { url: 'https://github.com/diegozanon/get-github-code', options: { username: 'other-user', repo: 'other-repo' } as DownloadOptions },
            { options: { username: 'diegozanon', repo: 'get-github-code' } as DownloadOptions },
            { options: { username: 'diegozanon', repo: 'get-github-code', branch: 'main' } as DownloadOptions }
        ];

        const invalids = [
            {},
            { url: 'https://example.com' },
            { url: 'https://github.com/diegozanon' },
            { url: 'https://github.com/get-github-code' },
            { options: { username: 'diegozanon' } as DownloadOptions },
            { options: { repo: 'get-github-code' } as DownloadOptions }
        ];

        for (const valid of valids) {
            const { url, options } = { ...valid };
            await expect(buildUrl(url, options)).resolves.toBe('https://codeload.github.com/diegozanon/get-github-code/zip/main');
        }

        for (const invalid of invalids) {
            const { url, options } = { ...invalid };
            await expect(buildUrl(url, options)).rejects.toBeTruthy();
        }
    });
});