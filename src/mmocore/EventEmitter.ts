export type EventHandler = ((evt: Event) => void) & { _once?: boolean };

export interface Event {
  type: string;
  data: any;
  once: boolean;
}

export default class EventEmitter {
  _eventHandlers: Record<string, EventHandler[] | undefined> = {};

  on(type: string, handler: EventHandler): boolean {
    if (!type || !handler) return false;

    let handlers = this._eventHandlers[type];
    if (!handlers) handlers = this._eventHandlers[type] = [];

    if (handlers.length > 10)
      console.warn(
        `Possible EventEmitter memory leak detected. There are registered ${handlers.length} events for "${type}"`
      );

    if (handlers.indexOf(handler) >= 0) return false;

    handler._once = false;
    handlers.push(handler);
    return true;
  }

  once(type: string, handler: EventHandler): boolean {
    if (!type || !handler) return false;

    const ret = this.on(type, handler);
    if (ret) {
      handler._once = true;
    }

    return ret;
  }

  off(type?: string, handler?: EventHandler): void {
    if (!type) return this.offAll();

    if (!handler) {
      this._eventHandlers[type] = [];
      return;
    }

    const handlers = this._eventHandlers[type];
    if (!handlers || !handlers.length) return;

    for (let i = 0; i < handlers.length; i++) {
      const fn = handlers[i];
      if (fn === handler) {
        handlers.splice(i, 1);
        break;
      }
    }
  }

  onAll(handler: EventHandler): boolean {
    return this.on("*", handler);
  }

  offAll(): void {
    this._eventHandlers = {};
  }

  fire(type: string, data?: Record<string, unknown>): void {
    if (!type) return;

    let handlers = this._eventHandlers[type] ?? [];
    const allHandlers = this._eventHandlers["*"] ?? [];
    if (allHandlers && allHandlers.length)
      handlers = handlers.concat(allHandlers);
    if (!handlers.length) return;

    const event = this.createEvent(type, data);

    for (const handler of handlers) {
      const once = (event.once = handler._once === true);

      handler(event);
      if (once) setTimeout(this.off.bind(this), 0, type, handler); // we should not modify handlers in for loop
    }
  }

  has(type: string, handler?: EventHandler): boolean {
    if (!type) return false;

    const handlers = this._eventHandlers[type];

    if (!handlers || !handlers.length) return false;
    if (!handler) return true;
    return handlers.indexOf(handler) >= 0;
  }

  getHandlers(type: string): any[] {
    if (!type) return [];
    return this._eventHandlers[type] || [];
  }

  createEvent(
    type: string,
    data?: Record<string, unknown>,
    once = false
  ): Event {
    const event: Event = { type, data, once };
    return event;
  }
}
