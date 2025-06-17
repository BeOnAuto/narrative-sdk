import { CommandBase } from './Commands';
import { EventBase } from './Events';
import {FileTransformRule, Scheme} from "./scheme";
import {registerFunction} from "./scheme/FunctionRegistry";

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
    // Clone scheme to avoid mutating consumer input
    const clonedScheme = JSON.parse(JSON.stringify(scheme)) as Scheme;
    const serializedScheme = this.serializeSchemeFunctions(clonedScheme);

    return new Promise((resolve, reject) => {
      this.messageHandler.postMessage({ type: 'create-scheme', scheme: serializedScheme });
      this.messageHandler.addMessageListener((event) => {
        if (event.data.type === 'command-response') {
          event.data.error ? reject(new Error(event.data.error)) : resolve();
        }
      });
    });
  }

  /**
   * Serializes all function references in a scheme (e.g., file transform rules)
   * so they can be postMessage-safe and later looked up by ID.
   */
  private static serializeSchemeFunctions(scheme: Scheme): Scheme {
    return {
      ...scheme,
      categories: scheme.categories.map((category) => ({
        ...category,
        constructs: category.constructs.map((construct) => ({
          ...construct,
          filesTransformRules: this.serializeFileTransformRules(construct.filesTransformRules),
        })),
        assets: category.assets.map((asset) => ({
          ...asset,
          filesTransformRules: this.serializeFileTransformRules(asset.filesTransformRules),
        })),
      })),
    };
  }

  /**
   * Replaces function fields with ID references and registers them.
   */
  private static serializeFileTransformRules(rules: FileTransformRule[] = []): FileTransformRule[] {
    return rules.map((rule) => {
      const transformedRule = { ...rule };

      if (typeof rule.transformToTarget === 'function') {
        const id = `transformToTarget:${rule.sourceName}->${rule.targetName}`;
        registerFunction(id, rule.transformToTarget);
        transformedRule.transformToTarget = id;
      }

      if (typeof rule.transformToSource === 'function') {
        const id = `transformToSource:${rule.sourceName}->${rule.targetName}`;
        registerFunction(id, rule.transformToSource);
        transformedRule.transformToSource = id;
      }

      if (typeof rule.merge === 'function') {
        const id = `merge:${rule.sourceName}->${rule.targetName}`;
        registerFunction(id, rule.merge);
        transformedRule.merge = id;
      }
      return transformedRule;
    });
  }

  //** Get<>(id: string): Promise<any> {

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