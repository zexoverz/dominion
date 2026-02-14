export type BusEventType = 'new-event' | 'mission-update' | 'proposal-update' | 'cost-update';
declare class EventBus {
    private emitter;
    constructor();
    emit(type: BusEventType, payload: any): void;
    on(type: BusEventType, callback: (payload: any) => void): void;
    off(type: BusEventType, callback: (payload: any) => void): void;
}
declare const eventBus: EventBus;
export default eventBus;
