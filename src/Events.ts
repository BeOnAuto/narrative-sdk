import { CommandConstructor, IParams } from './Narrative';
import { CommandBase } from './Commands';
import { EntityChanges } from './types';

export abstract class EventBase {
  public readonly params?: IParams;
  public readonly source?: CommandConstructor<CommandBase<IParams>>;

  protected static readonly eventType: string;

  public get type(): string {
    return (this.constructor as typeof EventBase).type;
  }

  public static get type(): string {
    if (!this.eventType) throw new Error('Event type not defined');
    return this.eventType;
  }
}

export class ChangesSavedEvent extends EventBase {
  constructor(public readonly changes: EntityChanges) {
    super();
  }
}