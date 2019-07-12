/* eslint-disable import/prefer-default-export */
const IPFS = require('ipfs');

const node = new IPFS();

node.on('ready', async () => {
    const version = await node.version();
    console.log('Version:', version);
});


export const addFile = async (fileName, content, network) => {
    const filesAdded = await node.add({
        path: fileName,
        content: Buffer.from(JSON.stringify(content)),
    });
    return filesAdded[0];
};

export const getFile = async (hashFile) => {
    const fileBuffer = await node.cat(hashFile);
    return JSON.parse(fileBuffer.toString());
};
