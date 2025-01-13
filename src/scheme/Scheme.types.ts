export enum PermissionAction {
    NONE = 0,
    ADD = 1 << 0,
    REMOVE = 1 << 1,
    REORDER = 1 << 2,
    ALL = ADD | REMOVE | REORDER,
}

export enum ConstructShape {
    RECTANGLE = 'rectangle',
    SQUARE = 'square',
}

export type PermissionConfig = {
    actions: PermissionAction[];
};

export type Style = {
    backgroundColor?: string;
    borderStyle?: string;
    borderColor?: string;
};

export type Styled = {
    style?: Partial<Style>;
};

export type Limits = {
    min: number;
    max: number | typeof Infinity;
};

export type Scheme = {
    name: string;
    categories: Category[];
};

export type Category = {
    name: string;
    assets: Asset[];
    constructs: Construct[];
    scripts: Script[];
};

export type Construct = {
    label: string;
    type: string;
    description: string;
    backgroundColor: string;
    textColor: string;
    shape: ConstructShape;
}

export type Asset = {
    label: string;
    type: string;
    description: string;
    icon: string;
    dataSource: string;
};

export type Script = Styled & {
    label: string;
    type: string;
    description: string;
    icon: string;
    frameGroups?: FrameGroup[];
    laneGroups?: LaneGroup[];
};

export type EntityType = string;

export type Entity = Asset | Construct | Script | EntityType;

export type Frame = Styled & {
    label?: string;
    allowedEntities?: Entity[];
    //permissions?: PermissionConfig;
    //laneLimits: Limits;
};

export type FrameGroup = Styled & {
    label?: string;
    permissions?: PermissionConfig;
    frameGroupLimits: Limits;
    frameLimits: Limits;
    frames?: Frame[];
    frameWidth?: number
    allowedEntities?: Entity[];
};

export type LaneGroup = Styled & {
    permissions?: PermissionConfig;
    laneGroupLimits: Limits;
    laneLimits: Limits;
    allowedEntities?: Entity[];
    /**
     * Groups of entities that cannot coexist in the same lane or group.
     * Each group represents entities that are mutually exclusive.
     * Entities can be specified as either full entity objects (e.g., `Asset`, `Construct`)
     * or as `EntityType` strings.
     */
    conflictingEntityGroups?: Entity[][]
    laneHeight?: number;
    entityLimits?: Limits;
    lanes?: Lane[];
};

export type Lane = Styled & {
    label?: string;
    icon?: string;
    allowedEntities?: Entity[];
    entityLimits?: Limits;
    /**
     * Groups of entities that cannot coexist in the same lane or group.
     * Each group represents entities that are mutually exclusive.
     * Entities can be specified as either full entity objects (e.g., `Asset`, `Construct`)
     * or as `EntityType` strings.
     */
    conflictingEntityGroups?: Entity[][];
};

