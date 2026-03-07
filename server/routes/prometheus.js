import express from 'express';
import * as testController from '../controller/speedtests.js';
import promClient from 'prom-client';
import * as config from '../controller/config.js';
import bcrypt from 'bcrypt';

const app = express.Router();

const pingGauge = new promClient.Gauge({name: 'myspeed_ping', help: 'Current ping in ms'});
const jitterGauge = new promClient.Gauge({name: 'myspeed_jitter', help: 'Current jitter in ms'});
const downloadGauge = new promClient.Gauge({name: 'myspeed_download', help: 'Current download speed in Mbps'});
const uploadGauge = new promClient.Gauge({name: 'myspeed_upload', help: 'Current upload speed in Mbps'});
const currentServerGauge = new promClient.Gauge({name: 'myspeed_server', help: 'Current server ID',});
const timeGauge = new promClient.Gauge({name: 'myspeed_time', help: 'Time of the test'});

app.get('/metrics', async (req, res) => {
    let passwordHash = await config.getValue("password");

    if (passwordHash !== "none") {
        if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
            res.setHeader('WWW-Authenticate', 'Basic realm="User Visible Realm"');
            return res.status(401).end('Unauthorized');
        }

        const base64Credentials =  req.headers.authorization.split(' ')[1];
        const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
        const [username, password] = credentials.split(':');

        if (username !== "prometheus" || !bcrypt.compareSync(password, passwordHash)) {
            res.setHeader('WWW-Authenticate', 'Basic realm="User Visible Realm"');
            return res.status(401).end('Unauthorized');
        }
    }

    const latest = await testController.getLatest();
    if (!latest) return res.status(500).end('No test found');

    if (latest.error || latest.ping === -1)
        return res.status(500).end('Error in the latest test');

    pingGauge.set(latest.ping);
    if (latest.jitter !== null && latest.jitter !== undefined)
        jitterGauge.set(latest.jitter);
    downloadGauge.set(latest.download);
    uploadGauge.set(latest.upload);
    currentServerGauge.set(latest.serverId);

    if (latest.time)
        timeGauge.set(latest.time);

    res.set('Content-Type', promClient.register.contentType);
    res.end(await promClient.register.metrics());
});

export default app;