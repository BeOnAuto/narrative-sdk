import { CommandBase } from './Commands';
import { EventBase } from './Events';

export interface IParams {}

export type CommandConstructor<T extends CommandBase<IParams>> = new (params: IParams) => T;
export type EventConstructor<T extends EventBase> = {
  new (...args: any[]): T;
  readonly type: string;
};

type StoreUpdatePayload<T> = {
  type: 'update-store';
  data: T;
};

export class Narrative {




  /**
   * Sends a command to be processed, specifying the command class and its parameters.
   * Resolves or rejects based on the command’s result.
   * @param CommandClass - The constructor of the command to be sent.
   * @param params - Parameters required by the command.
   * @returns Promise<void | Error> - Resolves on successful command execution, returns the error on failure.
   */
  sendCommand<T extends IParams>(CommandClass: CommandConstructor<CommandBase<T>>, params: T): Promise<void | Error> {
    return new Promise((resolve, reject) => {
      const payload = {
        type: 'command',
        commandClass: CommandClass.name,
        params,
      };
      self.postMessage(payload);
      self.addEventListener('message', (event) => {
        if (event.data.type === 'command-response') {
          event.data.error ? reject(new Error(event.data.error)) : resolve();
        }
      });
    });
  }

  /**
   * Subscribes to specified events and executes a handler function when the event is received.
   * @param eventClasses - An array of event constructors to subscribe to.
   * @param handler - A function to handle the incoming events.
   */
  subscribeToEvents<T extends EventBase>(eventClasses: EventConstructor<T>[], handler: (event: T) => void): void {
    eventClasses.forEach((EventClass) => {
      const payload = { type: 'subscribe', event: EventClass.type };
      self.postMessage(payload);
      self.addEventListener('message', (event) => {
        if (event.data.type === 'event' && eventClasses.some((ec) => ec.name === event.data.event)) {
          const eventClass = eventClasses.find((ec) => ec.name === event.data.event);
          if (eventClass) {
            handler(event.data.payload);
          }
        }
      });
    });
  }

  /**
   * Updates the ReadModel with the provided data.
   * @param data - The data to update the ReadModel with.
   */
  updateReadModel<T>(data: T): void {
    const payload: StoreUpdatePayload<T> = { type: 'update-store', data };
    self.postMessage(payload);
  }

}
