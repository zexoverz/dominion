"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
class EventBus {
    constructor() {
        this.emitter = new events_1.EventEmitter();
        this.emitter.setMaxListeners(100);
    }
    emit(type, payload) {
        this.emitter.emit(type, payload);
    }
    on(type, callback) {
        this.emitter.on(type, callback);
    }
    off(type, callback) {
        this.emitter.off(type, callback);
    }
}
const eventBus = new EventBus();
exports.default = eventBus;
