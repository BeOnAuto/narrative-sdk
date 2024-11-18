import { Position } from './types';

export abstract class CommandBase<TParams> {
  abstract readonly name: string;
  protected constructor(public readonly params: TParams) {}
}

export interface AddEntityParams {
  id: string;
  name: string;
  position: Position;
  type: string;
  createdBy?: string;
  assetId?: string;
}

export class AddEntityCommand extends CommandBase<AddEntityParams> {
  readonly name = 'AddEntityCommand';
  constructor(params: AddEntityParams) {
    super(params);
  }
}

export interface RenameEntityParams {
  entityId: string;
  newName: string;
}

export class RenameEntityCommand extends CommandBase<RenameEntityParams> {
  readonly name = 'RenameEntityCommand';
  constructor(params: RenameEntityParams) {
    super(params);
  }
}
