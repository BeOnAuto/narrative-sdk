
export type ScriptConfig = {
    frameGroups: FrameGroup[];
    laneGroups: LaneGroup[]
}

type Lane = {
    id: string;
    label: string;
    height: number;
    color: string;
};

type Frame = {
    id: string;
    width: number;
    entities: EntityBase[][];
    label: string;
};

type LaneGroup = {
    configIndex: number;
    laneIds: string[];
    label: string;
};

type FrameGroup = {
    configIndex: number;
    frameIds: string[];
    label: string;
};

export type EntityBase = {
    id: string;
    name: string;
    type: string;
    position: Position;
    parent?: EntityBase;
    children: EntityBase[];
};


export interface ConstructBase extends EntityBase {
    script: ScriptBase;
}

export interface ScriptBase extends EntityBase {
    config: ScriptConfig;
    frames: Frame[];
    lanes: Lane[];
    frameGroups: FrameGroup[];
    laneGroups: LaneGroup[];
}

export interface AssetBase extends EntityBase {

}

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
