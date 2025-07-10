const tests = require('../models/Speedtests');
const {Op, Sequelize} = require("sequelize");
const {mapFixed, mapRounded} = require("../util/helpers");

module.exports.create = async (ping, download, upload, time, serverId, type = "auto", resultId = null, error = null) => {
    return (await tests.create({ping, download, upload, error, serverId, type, resultId, time, created: new Date().toISOString()})).id;
}

module.exports.getOne = async (id) => {
    let speedtest = await tests.findByPk(id);
    if (speedtest === null) return null;
    if (speedtest.error === null) delete speedtest.error;
    return speedtest
}

module.exports.listAll = async () => {
    let dbEntries = await tests.findAll({order: [["created", "DESC"]]});
    for (let dbEntry of dbEntries) {
        if (dbEntry.error === null) delete dbEntry.error;
        if (dbEntry.resultId === null) delete dbEntry.resultId;
    }

    return dbEntries;
}

module.exports.listTests = async (afterId, limit) => {
    limit = parseInt(limit) || 10;

    let whereClause = {};
    
    if (afterId) whereClause.id = {[Op.lt]: afterId};

    let dbEntries = await tests.findAll({
        where: Object.keys(whereClause).length > 0 ? whereClause : undefined, 
        order: [["created", "DESC"]], 
        limit
    });

    for (let dbEntry of dbEntries) {
        if (dbEntry.error === null) delete dbEntry.error;
        if (dbEntry.resultId === null) delete dbEntry.resultId;
    }

    return dbEntries;
}

module.exports.deleteTests = async () => {
    await tests.destroy({where: {}});
    return true;
}

module.exports.importTests = async (data) => {
    if (!Array.isArray(data)) return false;

    for (let entry of data) {
        if (entry.error === null) delete entry.error;
        if (entry.resultId === null) delete entry.resultId;

        if (!["custom", "auto"].includes(entry.type)) continue;
        if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(entry.created)) continue;

        try {
            console.log(entry)
            await tests.create(entry);
        } catch (e) {
        }
    }

    return true;
}

module.exports.listStatistics = async (days) => {
    let dbEntries = (await tests.findAll({order: [["created", "DESC"]]}))
        .filter((entry) => new Date(entry.created) > new Date().getTime() - (days <= 30 ? days : 30 ) * 24 * 3600000);

    let notFailed = dbEntries.filter((entry) => entry.error === null);

    let data = {};
    ["ping", "download", "upload", "time"].forEach(item => {
        data[item] = notFailed.map(entry => entry[item]);
    });

    return {
        tests: {
            total: dbEntries.length,
            failed: dbEntries.length - notFailed.length,
            custom: dbEntries.filter((entry) => entry.type === "custom").length
        },
        ping: mapRounded(notFailed, "ping"),
        download: mapFixed(notFailed, "download"),
        upload: mapFixed(notFailed, "upload"),
        time: mapRounded(notFailed, "time"),
        data,
        labels: notFailed.map((entry) => new Date(entry.created).toISOString())
    };
}

module.exports.deleteOne = async (id) => {
    if (await this.getOne(id) === null) return false;
    await tests.destroy({where: {id: id}});
    return true;
}

module.exports.removeOld = async () => {
    await tests.destroy({
        where: {
            created: process.env.DB_TYPE === "mysql"
                ? {[Op.lte]: new Date(new Date().getTime() - 30 * 24 * 3600000)} // MySQL
                : {[Op.lte]: Sequelize.literal(`datetime('now', '-30 days')`)} // SQLite
        }
    });
    return true;
}

module.exports.getLatest = async () => {
    let latest = await tests.findOne({order: [["created", "DESC"]]});
    if (latest === null) return undefined;
    if (latest.error === null) delete latest.error;
    if (latest.resultId === null) delete latest.resultId;
    return latest;
}