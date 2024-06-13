import { Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

const room = new Map<string, Set<string>>();

export default function joinRouter(socker: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) {
    socker.on('joinRouter', () => {});
}
