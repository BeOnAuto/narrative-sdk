export enum PermissionAction {
    NONE = 0,
    ADD = 1 << 0,
    REMOVE = 1 << 1,
    REORDER = 1 << 2,
    UPDATE = 1 << 3,
    ALL = ADD | REMOVE | REORDER | UPDATE,
}

export enum ConstructShape {
    RECTANGLE = 'rectangle',
    SQUARE = 'square',
}

export type LabelAlignment =
    | 'top-left'
    | 'top-center'
    | 'top-right'
    | 'center-left'
    | 'center'
    | 'center-right'
    | 'bottom-left'
    | 'bottom-center'
    | 'bottom-right';


export type LabelConfig = {
    text: string;
    icon?: string;
    alignment?: LabelAlignment;
    fontSize?: number;
};

export type PermissionConfig = {
    actions: PermissionAction[];
};

export type AllowedEntityTypes =
    | { type: 'ALL' }
    | { type: 'NONE' }
    | { type: 'SPECIFIC'; entities: EntityType[] };

export type Style = {
    backgroundColor?: string // '#F8F8F8'
    borderWidth?: number; // 1
    borderColor?: string; // '#E4E4E8'
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
    description: string;
    type: string;
    backgroundColor: string;
    textColor: string;
    shape: ConstructShape;
}

export type Asset = {
    label: string;
    icon: string;
    description: string;
    type: string;
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
    label?: LabelConfig;
    allowedEntityTypes?: AllowedEntityTypes;
    //permissions?: PermissionConfig;
    //laneLimits: Limits;
    /**
     * Groups of entities that cannot coexist in the same lane or group.
     * Each group represents entities that are mutually exclusive.
     * Entities can be specified as either full entity objects (e.g., `Asset`, `Construct`)
     * or as `EntityType` strings.
     */
    conflictingEntityGroups?: Entity[][]
};

export type FrameGroup = Styled & {
    label?: LabelConfig;
    permissions?: PermissionConfig;
    frameGroupLimits: Limits;
    frameLimits: Limits;
    frames?: Frame[];
    frameWidth?: number
    allowedEntityTypes?: AllowedEntityTypes;
    /**
     * Groups of entities that cannot coexist in the same lane or group.
     * Each group represents entities that are mutually exclusive.
     * Entities can be specified as either full entity objects (e.g., `Asset`, `Construct`)
     * or as `EntityType` strings.
     */
    conflictingEntityGroups?: Entity[][]
};

export type LaneGroup = Styled & {
    label?: LabelConfig;
    permissions?: PermissionConfig;
    laneGroupLimits: Limits;
    laneLimits: Limits;
    allowedEntityTypes?: AllowedEntityTypes;
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
    autoIngestInCorrectLane?: boolean;
};

export type Lane = Styled & {
    label?: LabelConfig;
    allowedEntityTypes?: AllowedEntityTypes;
    entityLimits?: Limits;
    /**
     * Groups of entities that cannot coexist in the same lane or group.
     * Each group represents entities that are mutually exclusive.
     * Entities can be specified as either full entity objects (e.g., `Asset`, `Construct`)
     * or as `EntityType` strings.
     */
    conflictingEntityGroups?: Entity[][];
};

