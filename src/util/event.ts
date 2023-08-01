import Random from './random';

type EventCallback = (...argv: any[]) => void;

interface EventNotifier {
    on(event: string, cb: EventCallback): string;
    remove(event: string, subscribeId: string): void;
    clear(): void
}

abstract class EventNotifierBase implements EventNotifier {
    private _callbacks: { [key: string]: { [key: string]: EventCallback } } = {};
    private _random: Random = new Random();

    on(event: string, cb: EventCallback): string {
        if (!(event in this._callbacks)) {
            this._callbacks[event] = {};
        }
        const subscribeId = this._random.nanoid8();
        this._callbacks[event][subscribeId] = cb;
        return subscribeId;
    }

    remove(event: string, subscribeId: string): void {
        if (event in this._callbacks && subscribeId in this._callbacks[event]) {
            delete this._callbacks[event][subscribeId];
        }
    }

    clear(): void {
        this._callbacks = {};
    }

    protected _emit(event: string, ...argv: any[]): void {
        if (!(event in this._callbacks)) return;
        for (const cb of Object.values(this._callbacks[event])) {
            cb(...argv);
        }
    }
}

export default EventNotifier;
export {
    EventNotifierBase
};