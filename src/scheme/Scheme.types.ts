import {SerializationRule} from "./SerializationRule";

export enum DefaultViewMode {
    SIMPLE = 'simple',
    DEV = 'dev',
}

export type ViewMode = string;

export type ModeOverride<T> = Partial<Record<ViewMode, Partial<T>>>;

export enum AllowedAction {
    NONE = 0,
    ADD = 1 << 0,
    REMOVE = 1 << 1,
    REORDER = 1 << 2,
    UPDATE = 1 << 3,
    ALL = ADD | REMOVE | REORDER | UPDATE,
}


export enum FileType {
    JSON = 'json',
    SLATE = 'slate.json',
    GQL = 'gql',
    FEATURE = 'feature',
    PLAIN_TEXT = 'txt',
}

export type LabelAlignment =
    | 'left'
    | 'center'


export type LabelConfig = {
    text: string;
    textColor?: string;
    icon?: string;
    iconColor?: string;
    alignment?: LabelAlignment;
    fontSize?: number;
    backgroundColor?: string;
    placeHolder?: string;
    modeOverrides?: ModeOverride<LabelConfig>;
    visible?: boolean;
};

export type FileTransformContext = Record<string, unknown>;
export type FileTransformFn = (
    input: string,
    currentValue?: string,
    context?: FileTransformContext
) => string;
export type FileMergeFn = (
    source: string,
    target: string,
    context?: FileTransformContext
) => { source: string; target: string };

export type FileTransformRule = {
    sourceName: string;
    targetName: string;
    description?: string;
    transformToTarget?: FileTransformFn;
    transformToSource?: FileTransformFn;
    merge?: FileMergeFn;
};

export type FileDefinition = {
    name: string;
    type: FileType;
    defaultValue?: string | undefined;
    placeholder?: string;
}

export type FilesConfig = {
    files: FileDefinition[];
    transformRules?: FileTransformRule[];
};

export type AllowedActionsConfig = {
    actions: AllowedAction[];
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
    darkModeStyle?: Partial<Style>;
};

export type Limits = {
    min: number;
    max: number | typeof Infinity;
};

export type HandleLocation = 'top' | 'bottom' | 'left' | 'right';

export enum LineType {
    STRAIGHT = 'straight',
    CURVED = 'curved',
    ORTHOGONAL = 'orthogonal',
}

export type TransitionDefaults = {
    sourceHandleLocation?: HandleLocation;
    targetHandleLocation?: HandleLocation;
    lineType?: LineType;
    color?: string;
};

export type Scheme = {
    name: string;
    categories: Category[];
    fileExtension: string;
    defaultConstruct?: Construct | EntityType;
    defaultAsset?: Asset | EntityType;
    serializationRules?: SerializationRule[];
    viewModes?: ViewMode[];
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
    filesConfig?: FilesConfig;
    filesTransformRules?: FileTransformRule[];
    icon?: string;
    script?: Script;
    visible?: boolean;
    modeOverrides?: ModeOverride<Construct>;
    transitionDefaults?: TransitionDefaults;
    width?: number;
    height?: number;
}

export type Asset = {
    type: string;
    label: string;
    description: string;
    icon: string;
    dataSource?: string;
    filesConfig?: FilesConfig;
    filesTransformRules?: FileTransformRule[];
    transitionDefaults?: TransitionDefaults;
};

export type ScriptDetailMode = 'expand' | 'float';

export type Script = Styled & {
    type: string;
    frameGroups?: FrameGroup[];
    laneGroups?: LaneGroup[];
    transitionDefaults?: TransitionDefaults;
    detailMode: ScriptDetailMode;
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
    visible?: boolean;
    modeOverrides?: ModeOverride<Frame>;
};

export type FrameGroup = Styled & {
    label?: LabelConfig;
    allowedActions?: AllowedActionsConfig;
    frameGroupLimits: Limits;
    frameLimits: Limits;
    frames?: Frame[];
    defaultFrameWidth?: number;
    width?: number;
    allowedEntities?: AllowedEntityTypes;
    modeOverrides?: ModeOverride<LaneGroup>;

    /**
     * Groups of entities that cannot coexist in the same lane or group.
     * Each group represents entities that are mutually exclusive.
     * Entities can be specified as either full entity objects (e.g., `Asset`, `Construct`)
     * or as `EntityType` strings.
     */
    conflictingEntityGroups?: Entity[][]

    /**
     * Controls the value of the FrameGroup based on menu selection.
     * If set, selecting a menu item will update the frame group type
     */
    typeSelectMenu?: {
        type: string;
        text: string;
        icon?: string;
        frameGroupLabel: LabelConfig;
    }[];
    /**
     * The currently selected value from `typeSelectMenu`.
     * Defaults to `undefined` unless a menu item is selected.
     */
    defaultType?: string;
};

export type LaneGroup = Styled & {
    label?: LabelConfig;
    allowedActions?: AllowedActionsConfig;
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

    /**
     * Determines which modes this lane group is visible in.
     * - `SIMPLE`: Only visible in simple mode.
     * - `DEV`: Only visible in developer mode.
     * - `ALL`: Visible in both modes (default).
     */
    modeOverrides?: ModeOverride<LaneGroup>;
    visible?: boolean;

    mergeCellsAcrossFrameGroups?: boolean;
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
    modeOverrides?: ModeOverride<Lane>;
};