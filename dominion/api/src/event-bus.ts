import { EventEmitter } from 'events';

export type BusEventType = 'new-event' | 'mission-update' | 'proposal-update' | 'cost-update';

class EventBus {
  private emitter = new EventEmitter();

  constructor() {
    this.emitter.setMaxListeners(100);
  }

  emit(type: BusEventType, payload: any): void {
    this.emitter.emit(type, payload);
  }

  on(type: BusEventType, callback: (payload: any) => void): void {
    this.emitter.on(type, callback);
  }

  off(type: BusEventType, callback: (payload: any) => void): void {
    this.emitter.off(type, callback);
  }
}

const eventBus = new EventBus();
export default eventBus;
