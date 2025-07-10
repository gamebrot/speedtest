module.exports.replaceVariables = (message, variables) => {
    for (const variable in variables)
        message = message.replace(`%${variable}%`, variables[variable]);
    return message;
}

module.exports.mapFixed = (entries, type) => ({
    min: Math.min(...entries.map((entry) => entry[type])),
    max: Math.max(...entries.map((entry) => entry[type])),
    avg: parseFloat((entries.reduce((a, b) => a + b[type], 0) / entries.length).toFixed(2))
});

module.exports.mapRounded = (entries, type) => ({
    min: Math.min(...entries.map((entry) => entry[type])),
    max: Math.max(...entries.map((entry) => entry[type])),
    avg: Math.round(entries.reduce((a, b) => a + b[type], 0) / entries.length)
});