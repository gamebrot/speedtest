import axios from "axios";
import { replaceVariables } from "../util/helpers.js";

const defaults = {
    finished: "✨ *A speedtest is finished*\n🏓 `Ping`: %ping% ms (±%jitter% ms)\n🔼 `Upload`: %upload% Mbps\n🔽 `Download`: %download% Mbps",
    failed: "❌ *A speedtest has failed*\n`Reason`: %error%"
};

const postWebhook = async (token, chatId, message, triggerActivity) => {
    axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
        text: message, chat_id: chatId, parse_mode: "markdown"
    })
        .then(() => triggerActivity())
        .catch(() => triggerActivity(true));
};

export default (registerEvent) => {
    registerEvent('testFinished', async (integration, data, activity) => {
        if (integration.data.send_finished)
            await postWebhook(integration.data.token, integration.data.chat_id,
                replaceVariables(integration.data.finished_message || defaults.finished, data), activity)
    });

    registerEvent('testFailed', async (integration, error, activity) => {
        if (integration.data.send_failed)
            await postWebhook(integration.data.token, integration.data.chat_id,
                replaceVariables(integration.data.failed_message || defaults.failed, {error}), activity)
    });

    return {
        icon: "fa-brands fa-telegram",
        fields: [
            {name: "token", type: "text", required: true, regex: /(\d+):[a-zA-Z0-9_-]+/},
            {name: "chat_id", type: "text", required: true, regex: /\d+/},
            {name: "send_finished", type: "boolean", required: false},
            {name: "finished_message", type: "textarea", required: false},
            {name: "send_failed", type: "boolean", required: false},
            {name: "error_message", type: "textarea", required: false}
        ]
    };
};