const tests = require('../models/Speedtests');
const {Op, Sequelize} = require("sequelize");
const {mapFixed, mapRounded, calculateTestAverages} = require("../util/helpers");

module.exports.create = async (ping, download, upload, time, type = "auto", error = null) => {
    return (await tests.create({ping, download, upload, error, type, time})).id;
}

module.exports.getOne = async (id) => {
    let speedtest = await tests.findByPk(id);
    if (speedtest === null) return null;
    if (speedtest.error === null) delete speedtest.error;
    return speedtest
}

module.exports.listTests = async (hours = 24, start, limit) => {
    const whereClause = start ? {id: {[Op.lt]: start}} : undefined;

    let dbEntries = (await tests.findAll({where: whereClause, order: [["created", "DESC"]], limit}))
        .filter((entry) => new Date(entry.created) > new Date().getTime() - hours * 3600000);

    for (let dbEntry of dbEntries)
        if (dbEntry.error === null) delete dbEntry.error;

    return dbEntries;
}

module.exports.listByDays = async (days) => {
    let dbEntries = (await tests.findAll({order: [["created", "DESC"]]})).filter((entry) => entry.error === null)
        .filter((entry) => new Date(entry.created) > new Date().getTime() - days * 24 * 3600000);

    let averages = {};
    dbEntries.forEach((entry) => {
        const day = new Date(entry.created).toLocaleDateString();
        if (!averages[day]) averages[day] = [];
        averages[day].push(entry);
    });

    return averages;
}

module.exports.listAverage = async (days) => {
    const averages = await this.listByDays(days);
    let result = [];

    if (Object.keys(averages).length !== 0)
        result.push(averages[Object.keys(averages)[0]][0]);

    for (let day in averages) {
        let currentDay = averages[day];
        let avgNumbers = calculateTestAverages(currentDay);

        const created = new Date(currentDay[0].created);
        result.push({
            ping: Math.round(avgNumbers["ping"]),
            download: parseFloat((avgNumbers["down"]).toFixed(2)),
            upload: parseFloat((avgNumbers["up"]).toFixed(2)),
            time: Math.round(avgNumbers["time"]),
            type: "average",
            amount: currentDay.length,
            created: created.getFullYear() + "-" + (created.getMonth() + 1) + "-" + created.getDate()
        });
    }

    return result;
}

module.exports.listStatistics = async (days) => {
    let dbEntries = (await tests.findAll({order: [["created", "DESC"]]}))
        .filter((entry) => new Date(entry.created) > new Date().getTime() - (days <= 30 ? days : 30 ) * 24 * 3600000);

    let avgEntries = [];
    if (days >= 3) avgEntries = await this.listAverage(days);

    let notFailed = dbEntries.filter((entry) => entry.error === null);

    let data = ["ping", "download", "upload", "time"]
        .map((item) => days >= 3 ? avgEntries.map(entry => entry[item]) : notFailed.map(entry => entry[item]));

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
        labels: days >= 3 ? avgEntries.map((entry) => new Date(entry.created).toLocaleDateString())
            : notFailed.map((entry) => new Date(entry.created).toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"}))
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
            created: {
                [Op.lte]: Sequelize.literal(`datetime('now', '-30 days')`)
            }
        }
    });
    return true;
}