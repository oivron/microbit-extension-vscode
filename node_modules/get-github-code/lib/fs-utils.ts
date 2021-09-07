import * as fs from 'fs';
import * as path from 'path';

export const exist = async (file: string): Promise<boolean> => {
    try {
        await fs.promises.lstat(file);
        return true;
    } catch (_) {
        return false;
    }
}

export const isDir = async (file: string): Promise<boolean> => {
    try {
        return (await fs.promises.lstat(file)).isDirectory();
    } catch (_) {
        return false;
    }
}

export const rmdirRecursive = async (dir: string): Promise<void> => {
    if (await exist(dir)) {
        const files = await fs.promises.readdir(dir);
        for (const file of files) {
            const currPath = path.join(dir, file);
            if ((await fs.promises.lstat(currPath)).isDirectory()) {
                await rmdirRecursive(currPath);
            } else {
                await fs.promises.unlink(currPath);
            }
        }

        await fs.promises.rmdir(dir);
    }
}

export const moveFilesUp = async (dir: string): Promise<void> => {

    const files = await fs.promises.readdir(dir);

    // finds the most recent folder first, to decide from which one we should move the files up
    const mostRecentDir = {
        path: '',
        mtime: 0
    }

    for (const file of files) {
        const stats = await fs.promises.stat(path.join(dir, file));
        if (stats.isDirectory() && stats.mtime.getTime() > mostRecentDir.mtime) {
            mostRecentDir.path = path.join(dir, file);
            mostRecentDir.mtime = stats.mtime.getTime();
        }
    }

    // move (=rename) all files
    const filesToMove = await fs.promises.readdir(mostRecentDir.path);
    for (const fileToMove of filesToMove) {
        const fullPathToMove = path.join(mostRecentDir.path, fileToMove);
        const newPath = path.join(path.join(fullPathToMove, '..', '..'), fileToMove);

        if (await isDir(newPath)) { // if already exists and is a dir, delete all contents
            await rmdirRecursive(newPath);
        }

        fs.promises.rename(fullPathToMove, newPath);
    }

    // removes the empty folder
    await rmdirRecursive(mostRecentDir.path);
}