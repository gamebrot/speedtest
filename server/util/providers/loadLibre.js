import fs from 'node:fs';
import { get } from 'node:https';
import decompress from "decompress";
import { file } from "tmp";
import decompressTarGz from 'decompress-targz';
import decompressUnzip from 'decompress-unzip';
import { libreVersion, libreList } from '../../config/binaries.js';
import path from 'node:path';

const binaryRegex = /librespeed-cli(.exe)?$/;
const binaryDirectory = path.join(process.cwd(), "bin");
const binaryPath = path.join(binaryDirectory, "librespeed-cli" + (process.platform === "win32" ? ".exe" : ""));

const downloadPath = `https://github.com/librespeed/speedtest-cli/releases/download/v${libreVersion}/librespeed-cli_${libreVersion}_`;

export const fileExists = async () => fs.existsSync(binaryPath);

export const downloadFile = async () => {
    const binary = libreList.find(b => b.os === process.platform && b.arch === process.arch);

    if (!binary)
        throw new Error(`Your platform (${process.platform}-${process.arch}) is not supported by the LibreSpeed CLI`);

    await new Promise((resolve) => {
        file({postfix: binary.suffix}, async (err, tmpPath) => {
            const location = await new Promise((resolve) => get(downloadPath + binary.suffix, (res) => {
                resolve(res.headers.location);
            }));

            get(location, async resp => {
                resp.pipe(fs.createWriteStream(tmpPath)).on('finish', async () => {
                    await decompress(tmpPath, binaryDirectory, {
                        plugins: [decompressTarGz(), decompressUnzip()],
                        filter: file => binaryRegex.test(file.path),
                        map: file => {
                            file.path = "librespeed-cli" + (process.platform === "win32" ? ".exe" : "");
                            return file;
                        }
                    });
                    resolve();
                });
            });
        });
    });
};

export const load = async () => {
    if (!await fileExists())
        await downloadFile();
};