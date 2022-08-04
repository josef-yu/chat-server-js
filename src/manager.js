import * as uuid from 'uuid';

export class ChatManager {
    constructor() {
        this.clients = {}
    }

    insert(connection) {
        const address = connection._socket.remoteAddress
        const id = uuid.v1();
        this.clients[address] = {
            id, connection
        }
        return id
    }

    setName(address, name) {
        this.clients[address].name = name
    }

    getName(address) {
        return this.clients[address].name
    }

    getClient(address) {
        return this.clients[address]
    }

    remove(address) {
        delete this.clients[address]
    }
}