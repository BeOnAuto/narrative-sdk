export type EntityBase = {
  id: string;
  name: string;
  type: string;
  position: Position;
  parentId?: string;
};

export type Position = {
  x: number;
  y: number;
};

export type UpdatedEntity = {
  entity: EntityBase;
  modifiedProperties: string[];
};

export type DeletedEntity = {
  id: string;
  type: string;
  scopes: string[];
};

export type EntityChanges = {
  added: EntityBase[];
  updated: UpdatedEntity[];
  deleted: DeletedEntity[];
};

export type EventParams = {
  EntitiesAddedEvent: { entityIds: string[] };
  EntityRenamedEvent: { entityId: string; newName: string };
  ChangesSavedEvent: { changes: EntityChanges };
};

export type EventName = keyof EventParams;
