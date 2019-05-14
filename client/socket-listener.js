import SocketTypes from './helpers/enums/socket-types';
import io from 'socket.io-client';
import config from './config';

//export let emergencySocketinfo;
const { socketIOMsgType } = constants;

const handleSocketMsgMapping = mobxStore => ({ 
    [socketIOMsgType.NEW_EMERGENCY]: mobxStore.emergency.getEmergencies
});


export const connectSocket = () => {
    const socket = io.connect(config.socketIODomain, { 'forceNew': true });
    return socket;
};

export const startListening = async mobxStore => {
    const eventsMap = handleSocketMsgMapping(mobxStore);
    
    const socket = connectSocket();

    Object.keys(eventsMap).map( async eventKey => {
        await socket.on(eventKey, async data => {
            await eventsMap[eventKey]();
        })
    });
};
