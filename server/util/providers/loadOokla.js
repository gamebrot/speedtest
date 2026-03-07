import fs from 'node:fs';
import { get } from 'node:https';
import decompress from "decompress";
import { file } from "tmp";
import decompressTarGz from 'decompress-targz';
import decompressUnzip from 'decompress-unzip';
import { ooklaVersion, ooklaList } from '../../config/binaries.js';
import path from 'node:path';

const binaryRegex = /speedtest(.exe)?$/;
const binaryDirectory = path.join(process.cwd(), "bin");
const binaryPath = path.join(binaryDirectory, "speedtest" + (process.platform === "win32" ? ".exe" : ""));

const downloadPath = `https://install.speedtest.net/app/cli/ookla-speedtest-${ooklaVersion}-`;

export const fileExists = async () => fs.existsSync(binaryPath);

export const downloadFile = async () => {
    const binary = ooklaList.find(b => b.os === process.platform && b.arch === process.arch);

    if (!binary)
        throw new Error(`Your platform (${process.platform}-${process.arch}) is not supported by the Speedtest CLI`);

    await new Promise((resolve) => {
        file({postfix: binary.suffix}, async (err, tmpPath) => {
            get(downloadPath + binary.suffix, async resp => {
                resp.pipe(fs.createWriteStream(tmpPath)).on('finish', async () => {
                    await decompress(tmpPath, binaryDirectory, {
                        plugins: [decompressTarGz(), decompressUnzip()],
                        filter: file => binaryRegex.test(file.path),
                        map: file => {
                            file.path = "speedtest" + (process.platform === "win32" ? ".exe" : "");
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