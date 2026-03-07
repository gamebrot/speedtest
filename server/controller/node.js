import axios from 'axios';
import nodes from '../models/Node.js';

export const listAll = async () => await nodes.findAll()
    .then((result) => result.map((node) => ({...node, password: node.password !== null})));

export const create = async (name, url, password) => await nodes.create({name: name, url: url, password: password});

export const deleteNode = async (nodeId) => await nodes.destroy({where: {id: nodeId}});

export const getOne = async (nodeId) => await nodes.findOne({where: {id: nodeId}});

export const updateName = async (nodeId, name) => await nodes.update({name: name}, {where: {id: nodeId}});

export const updatePassword = async (nodeId, password) => await nodes.update({password: password}, {where: {id: nodeId}});

export const checkStatus = async (url, password) => {
    if (password === "none") password = undefined;
    const api = await axios.get(url + "/api/config", {
        headers: {password: password},
        validateStatus: (status) => status < 500
    }).catch(() => {
        return "INVALID_URL";
    });

    if (api === "INVALID_URL") return "INVALID_URL";
    if (api.status === 401) return "PASSWORD_REQUIRED";
    if (api.status !== 200) return "INVALID_URL";

    if (!api.data.ping) return "INVALID_URL";

    if (api.data.viewMode) return "PASSWORD_REQUIRED";

    return "NODE_VALID";
}

export const proxyRequest = async (url, req, res) => {
    const response = await axios(url, {
        method: req.method,
        headers: req.headers,
        data: req.method === "GET" ? undefined : JSON.stringify(req.body),
        signal: req.signal,
        validateStatus: (status) => status < 500
    }).catch(() => "INVALID_URL");

    if (response === "INVALID_URL")
        return res.status(500).json({message: "Internal server error"});

    if (response.headers["content-disposition"])
        res.setHeader("content-disposition", response.headers["content-disposition"]);

    res.status(response.status).json(response.data);
}