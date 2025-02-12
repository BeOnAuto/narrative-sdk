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

export enum FileType {
    JSON = 'json',
    SLATE = 'slate',
    GQL = 'gql',
}


export type LabelAlignment =
    | 'left'
    | 'center'


export type LabelConfig = {
    text: string;
    icon?: string;
    alignment?: LabelAlignment;
    fontSize?: number;
    backgroundColor?: string;
};

export type FileConfig = {
    type: FileType;
    defaultValue: string;
}

export type PermissionConfig = {
    actions: PermissionAction[];
};

export type AllowedEntityTypes =
    | { type: 'ALL' }
    | { type: 'NONE' }
    | { type: 'SPECIFIC'; entities: Entity[] };

export type Style = {
    backgroundColor?: string // '#F8F8F8'
    borderWidth?: number; // 1
    borderColor?: string; // '#E4E4E8'
    textColor?: string; // '#000000'
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
};

export type Construct = Styled & {
    type: string;
    label: string;
    description: string;
    fileConfig?: FileConfig;
    icon?: string;
    shape: ConstructShape;
    script?: Script;
}

export type Asset = {
    type: string;
    label: string;
    description: string;
    icon: string;
    dataSource?: string;
};

export type Script = Styled & {
    type: string;
    frameGroups?: FrameGroup[];
    laneGroups?: LaneGroup[];
};

export type EntityType = string;

export type Entity = Asset | Construct | Script | EntityType;

export type Frame = Styled & {
    label?: LabelConfig;
    allowedEntities?: AllowedEntityTypes;
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
    defaultFrameWidth?: number
    width?: number;
    allowedEntities?: AllowedEntityTypes;
    /**
     * Groups of entities that cannot coexist in the same lane or group.
     * Each group represents entities that are mutually exclusive.
     * Entities can be specified as either full entity objects (e.g., `Asset`, `Construct`)
     * or as `EntityType` strings.
     */
    conflictingEntityGroups?: Entity[][]
    menuItems?: {
        text: string;
        frameGroupLabel: LabelConfig;
    }[];
};

export type LaneGroup = Styled & {
    label?: LabelConfig;
    permissions?: PermissionConfig;
    laneGroupLimits: Limits;
    laneLimits: Limits;
    allowedEntities?: AllowedEntityTypes;
    /**
     * Groups of entities that cannot coexist in the same lane or group.
     * Each group represents entities that are mutually exclusive.
     * Entities can be specified as either full entity objects (e.g., `Asset`, `Construct`)
     * or as `EntityType` strings.
     */
    conflictingEntityGroups?: Entity[][];
    height?: number;
    defaultLaneHeight?: number;
    entityLimits?: Limits;
    lanes?: Lane[];
    autoIngestInCorrectLane?: boolean;
    /**
     * Determines which frame index the lane should start at within the lane group.
     * If not specified, it aligns with the lane group.
     */
    laneAlignmentFrameIndex?: number;
};

export type Lane = Styled & {
    label?: LabelConfig;
    allowedEntities?: AllowedEntityTypes;
    height?: number;
    entityLimits?: Limits;
    /**
     * Groups of entities that cannot coexist in the same lane or group.
     * Each group represents entities that are mutually exclusive.
     * Entities can be specified as either full entity objects (e.g., `Asset`, `Construct`)
     * or as `EntityType` strings.
     */
    conflictingEntityGroups?: Entity[][];
};