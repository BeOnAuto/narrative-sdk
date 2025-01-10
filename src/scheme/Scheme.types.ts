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

export type StyleConfig = {
    backgroundColor?: string;
    borderStyle?: string;
    borderColor?: string;
};

export type Styled = {
    style?: Partial<StyleConfig>;
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
    name: string;
    allowedEntities: Entity[];
    permissions?: PermissionConfig;
    countLimits: Limits;
};

export type FrameGroup = Styled & {
    label: string;
    permissions?: PermissionConfig;
    countLimits: Limits;
    frames: Frame[];
};

export type Lane = Styled & {
    label: string;
    icon: string;
    allowedEntities: Entity[];
    countLimits: Limits;
    allowMultipleEntities?: boolean;
    permissions: PermissionConfig;
};

export type LaneGroup = {
    permissions?: PermissionConfig;
    countLimits: Limits;
    lanes?: Lane[];
};