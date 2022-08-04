import express from 'express';
import http from 'http';
import * as WebSocket from 'ws';
import { ChatManager } from './manager.js';

const app = express();

const server = http.createServer(app);

const wss = new WebSocket.WebSocketServer({server});

const manager = new ChatManager();

wss.on('connection', (wsConnection, request) => {
    const address = request.socket.remoteAddress;

    console.log(`CONNECTION: ${address} connected`)

    manager.insert(wsConnection);

    wsConnection.on('message', msg => {
        const object = JSON.parse(msg);
        console.log(`${address} INFO: ${msg}`)

        if(object.type == 'message') {
            const client = manager.getClient(address);
            if(client.name)
                object.sender = client.name
            else
                object.sender = client.id.substring(0, 8)

            wss.clients.forEach(client => {
                if(client._socket.remoteAddress != address) {
                    client.send(JSON.stringify(object))
                }
            })
    
            wsConnection.send(JSON.stringify({
                success: true,
                ...object
            }))
        } else if(object.type == 'name') {
            manager.setName(address, object.name)
            wsConnection.send(JSON.stringify({
                success: true,
                ...object
            }))
        }

        
    })

    wsConnection.on('close', client => {
        console.log(`CONNECTION: ${address} closed`);

    })

    wsConnection.send('Hello, welcome to the chat room!')
})


server.listen(8100, '0.0.0.0', () => {
    console.log('Listening on port 8100...')
})