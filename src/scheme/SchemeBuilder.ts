import {
    Asset,
    Category,
    Construct,
    Frame,
    FrameGroup,
    Lane,
    LaneGroup,
    Scheme,
    Script,
    ViewMode,
    Container, DockZone
} from './Scheme.types';
import {SerializationRule} from './SerializationRule';

interface SchemeBuilderStart {
    addCategory(name: string): SchemeBuilderCategory;

    withSerializationRules(rules: SerializationRule[]): SchemeBuilderStart;

    withViewModes(modes: ViewMode[]): SchemeBuilderStart;
}

interface SchemeBuilderCategory {
    addAsset(asset: Asset): SchemeBuilderCategory;

    addConstruct(construct: Construct): SchemeBuilderConstructStart;

    addCategory(name: string): SchemeBuilderCategory;

    addContainer(container: Container): SchemeBuilderCategory;

    build(): Scheme;
}

interface SchemeBuilderConstructStart extends SchemeBuilderCategory {
    addScript(script: Script): SchemeBuilderScriptStart;

    withZones(zone: DockZone[]): SchemeBuilderConstructStart;
}

interface SchemeBuilderScriptStart {
    addFrameGroup(frameGroup: FrameGroup): SchemeBuilderScriptFrameGroup;

    addLaneGroup(laneGroup: LaneGroup): SchemeBuilderScriptLaneGroup;

    build(): Scheme;
}

interface SchemeBuilderScriptFrameGroup extends SchemeBuilderCategory {
    addFrame(frame: Frame): SchemeBuilderScriptFrameGroup;

    addFrameGroup(frameGroup: FrameGroup): SchemeBuilderScriptFrameGroup;

    addLaneGroup(laneGroup: LaneGroup): SchemeBuilderScriptLaneGroup;
}

interface SchemeBuilderScriptLaneGroup extends SchemeBuilderCategory {
    addLane(lane: Lane): SchemeBuilderScriptLaneGroup;

    addLaneGroup(laneGroup: LaneGroup): SchemeBuilderScriptLaneGroup;

    addFrameGroup(frameGroup: FrameGroup): SchemeBuilderScriptFrameGroup;
}


type SchemeInput = Omit<Scheme, 'categories'> & {
    categories?: Category[];
    serializationRules?: SerializationRule[];
    viewModes?: ViewMode[];
};

export interface ISchemeProvider {
    getScheme(): Scheme;
}

export class SchemeBuilder
    implements SchemeBuilderStart,
        SchemeBuilderCategory,
        SchemeBuilderConstructStart,
        SchemeBuilderScriptStart,
        SchemeBuilderScriptFrameGroup,
        SchemeBuilderScriptLaneGroup {
    private readonly scheme: Scheme;
    private currentCategory?: Category;
    private currentConstruct?: Construct;
    private currentScript?: Script;
    private currentFrameGroup?: FrameGroup;
    private currentLaneGroup?: LaneGroup;

    private constructor(scheme: SchemeInput) {
        this.scheme = {
            ...scheme,
            categories: scheme.categories ?? [],
        };
    }

    static create(scheme: SchemeInput): SchemeBuilderStart {
        return new SchemeBuilder(scheme);
    }

    withSerializationRules(rules: SerializationRule[]): SchemeBuilderStart {
        this.scheme.serializationRules = rules;
        return this;
    }

    withViewModes(modes: ViewMode[]): SchemeBuilderStart {
        this.scheme.viewModes = modes;
        return this;
    }

    addCategory(name: string): SchemeBuilderCategory {
        this.finalizePendingItems();
        this.currentCategory = {
            name,
            assets: [],
            constructs: [],
            containers: [],
        };
        this.scheme.categories.push(this.currentCategory);
        return this;
    }

    addConstruct(construct: Construct): SchemeBuilderConstructStart {
        this.ensureCategoryExists();
        this.currentConstruct = {...construct};
        this.currentCategory!.constructs.push(this.currentConstruct);
        return this;
    }

    addAsset(asset: Asset): SchemeBuilderCategory {
        this.ensureCategoryExists();
        this.currentCategory!.assets.push(asset);
        return this;
    }

    addContainer(container: Container): SchemeBuilderCategory {
        this.ensureCategoryExists();
        if (!this.currentCategory!.containers) this.currentCategory!.containers = [];
        this.currentCategory!.containers.push(container);
        return this;
    }

    withZones(zones: DockZone[]): SchemeBuilderConstructStart {
        this.ensureConstructExists();
        if (!this.currentConstruct!.zones) this.currentConstruct!.zones = [];
        this.currentConstruct!.zones = zones;
        return this;
    }

    addScript(script: Script): SchemeBuilderScriptStart {
        this.ensureConstructExists();
        this.currentScript = {...script, frameGroups: [], laneGroups: []};
        this.currentConstruct!.script = this.currentScript;
        return this;
    }

    addFrameGroup(frameGroup: FrameGroup): SchemeBuilderScriptFrameGroup {
        this.ensureScriptExists();
        this.currentFrameGroup = {...frameGroup, frames: []};
        this.currentScript!.frameGroups!.push(this.currentFrameGroup);
        this.currentLaneGroup = undefined; // prevent lanes in frameGroup context
        return this;
    }

    addFrame(frame: Frame): SchemeBuilderScriptFrameGroup {
        this.ensureFrameGroupExists();
        this.currentFrameGroup!.frames!.push(frame);
        return this;
    }

    addLaneGroup(laneGroup: LaneGroup): SchemeBuilderScriptLaneGroup {
        this.ensureScriptExists();
        this.currentLaneGroup = {...laneGroup, lanes: []};
        this.currentScript!.laneGroups!.push(this.currentLaneGroup);
        this.currentFrameGroup = undefined; // prevent frames in laneGroup context
        return this;
    }

    addLane(lane: Lane): SchemeBuilderScriptLaneGroup {
        this.ensureLaneGroupExists();
        this.currentLaneGroup!.lanes!.push(lane);
        return this;
    }

    build(): Scheme {
        this.finalizePendingItems();
        return this.scheme;
    }

    private finalizePendingItems(): void {
        this.currentCategory = undefined;
        this.currentConstruct = undefined;
        this.currentScript = undefined;
        this.currentFrameGroup = undefined;
        this.currentLaneGroup = undefined;
    }

    private ensureCategoryExists(): void {
        if (!this.currentCategory) {
            throw new Error('Cannot add elements without a category. Call addCategory() first.');
        }
    }

    private ensureConstructExists(): void {
        if (!this.currentConstruct) {
            throw new Error('Cannot add a script without a construct. Call addConstruct() first.');
        }
    }

    private ensureScriptExists(): void {
        if (!this.currentScript) {
            throw new Error('Cannot add elements without a script. Call addScript() first.');
        }
    }

    private ensureFrameGroupExists(): void {
        if (!this.currentFrameGroup) {
            throw new Error('Cannot add frames without a frame group. Call addFrameGroup() first.');
        }
    }

    private ensureLaneGroupExists(): void {
        if (!this.currentLaneGroup) {
            throw new Error('Cannot add lanes without a lane group. Call addLaneGroup() first.');
        }
    }
}