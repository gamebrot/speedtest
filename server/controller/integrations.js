import IntegrationData from '../models/IntegrationData.js';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const integrations = {};

const events = {};

const registerEvent = (module) => (name, callback) => {
    if (!events[name]) events[name] = [];
    events[name].push({module, callback});
}

const getActiveByName = async (name) => {
    const data = await IntegrationData.findAll({where: {name: name}});
    if (!data) return null;

    return data.map((item) => ({...item, data: JSON.parse(item.data)}));
}

const triggerActivity = async (id, error = false) => {
    await IntegrationData.update({lastActivity: new Date().toISOString(), activityFailed: error}, {where: {id: id}});
}

export const triggerEvent = async (name, data) => {
    if (!events[name]) return;

    for (const module of events[name]) {
        const active = await getActiveByName(module.module);
        for (const integration of active)
            await module.callback(integration, data, (error = false) => triggerActivity(integration.id, error));
    }
}

export const initialize = async () => {
    const integrationsDir = path.join(__dirname, '..', 'integrations');

    for await (const entry of Deno.readDir(integrationsDir)) {
        if (!entry.isFile || !entry.name.endsWith('.js')) continue;

        const integrationName = entry.name.replace('.js', '');
        const filePath = path.join(integrationsDir, entry.name);

        const module = await import(`file://${filePath}`);
        integrations[integrationName] = module.default(registerEvent(integrationName));
        console.log(`Integration "${integrationName}" loaded successfully`);
    }
};

export const getActive = async () => {
    const data = await IntegrationData.findAll();
    if (!data) return null;

    return data.map((item) => ({...item, data: JSON.parse(item.data)}));
}

export const getIntegrationById = (id) => IntegrationData.findOne({where: {id: id}});

export const deleteIntegration = async (id) => {
    const data = await IntegrationData.findOne({where: {id}});
    if (!data) return null;

    await IntegrationData.destroy({where: {id}});
    return true;
}

export const create = async (name, data) => {
    const integration = integrations[name];
    if (!integration) return null;

    const displayName = data.integration_name;
    delete data.integration_name;

    const created = await IntegrationData.create({name: name, data: data, displayName});

    return created.id;
}

export const patch = async (id, data) => {
    const item = await IntegrationData.findOne({where: {id: id}});
    if (!item) return null;

    const displayName = data.integration_name;
    delete data.integration_name;

    IntegrationData.update({data: {...JSON.parse(item.data), ...data}, displayName}, {where: {id: id}});
    return true;
}

export const getIntegrations = () => {
    const result = {};

    for (const [name, integration] of Object.entries(integrations)) {
        const updatedIntegration = {...integration};

        updatedIntegration.fields = updatedIntegration.fields.map((field) => ({
            ...field, regex: field.regex ? field.regex.source : undefined
        }));

        result[name] = {name, ...updatedIntegration};
    }

    return result;
};

export const getIntegration = (name) => integrations[name];

export const validateInput = (module, data) => {
    const integration = integrations[module];
    if (!integration) return false;

    for (const field of integration.fields) {
        if (field.required && (!data[field.name] || data[field.name] === "")) return false;

        if (data[field.name] !== undefined) {
            if (field.regex && !new RegExp(field.regex).test(data[field.name])) return false;
            if (field.type === "text" && data[field.name].length > 250) return false;
            if (field.type === "textarea" && data[field.name].length > 2000) return false;
            if (field.type === "boolean" && typeof data[field.name] !== "boolean") return false;
        }
    }

    const result = {};
    for (const field of integration.fields) result[field.name] = data[field.name];
    result["integration_name"] = data["integration_name"];

    return result;
}