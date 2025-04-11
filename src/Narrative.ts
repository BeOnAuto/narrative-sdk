import { CommandBase } from './Commands';
import { EventBase } from './Events';
import {Scheme} from "./scheme";

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

interface MessageHandler {
  postMessage: (message: any) => void;
  addMessageListener: (listener: (event: MessageEvent) => void) => void;
}

class WorkerMessageHandler implements MessageHandler {
  postMessage(message: any): void {
    self.postMessage(message);
  }

  addMessageListener(listener: (event: MessageEvent) => void): void {
    self.addEventListener('message', listener);
  }
}

export class Narrative {

  private static messageHandler: MessageHandler = new WorkerMessageHandler();

  /** @internal */
  static _setMessageHandler(handler: MessageHandler): void {
    this.messageHandler = handler;
  }

  /**
   * Creates a new scheme.
   * @param scheme - The scheme to create.
   * @returns Promise<void | Error> - Resolves on successful scheme creation, returns the error on failure.
   */
  static createScheme(scheme: Scheme): Promise<void | Error> {
    return new Promise((resolve, reject) => {
      this.messageHandler.postMessage({ type: 'create-scheme', scheme });
      this.messageHandler.addMessageListener((event) => {
        if (event.data.type === 'command-response') {
          event.data.error ? reject(new Error(event.data.error)) : resolve();
        }
      });
    });
  }

  /**
   * Sends a command to be processed, specifying the command class and its parameters.
   * Resolves or rejects based on the command’s result.
   * @param CommandClass - The constructor of the command to be sent.
   * @param params - Parameters required by the command.
   * @returns Promise<void | Error> - Resolves on successful command execution, returns the error on failure.
   */
  static sendCommand<T extends IParams>(CommandClass: CommandConstructor<CommandBase<T>>, params: T): Promise<void | Error> {
    return new Promise((resolve, reject) => {
      const payload = {
        type: 'command',
        commandClass: new CommandClass(params).name,
        params,
      };
      this.messageHandler.postMessage(payload);
      this.messageHandler.addMessageListener((event) => {
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
  static subscribeToEvents<T extends EventBase>(eventClasses: EventConstructor<T>[], handler: (event: T) => void): void {
    eventClasses.forEach((EventClass) => {
      const payload = { type: 'subscribe', event: EventClass.type };
      this.messageHandler.postMessage(payload);
      this.messageHandler.addMessageListener((event) => {
        if (event.data.type === 'event' && eventClasses.some((ec) => ec.type === event.data.event)) {
          const eventClass = eventClasses.find((ec) => ec.type === event.data.event);
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
  static updateReadModel<T>(data: T): void {
    const payload: StoreUpdatePayload<T> = { type: 'update-store', data };
    this.messageHandler.postMessage(payload);
  }
}