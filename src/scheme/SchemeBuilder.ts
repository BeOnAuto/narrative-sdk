import { Asset, Category, Construct, Frame, FrameGroup, Lane, LaneGroup, Scheme, Script } from "./Scheme.types";

interface SchemeBuilderStart {
    addCategory(name: string): SchemeBuilderCategory;
}

interface SchemeBuilderCategory {
    addAsset(asset: Asset): SchemeBuilderCategory;
    addConstruct(construct: Construct): SchemeBuilderCategory;
    addScript(script: Script): SchemeBuilderScriptStart;
    addCategory(name: string): SchemeBuilderCategory;
    build(): Scheme;
}

interface SchemeBuilderScriptStart {
    addFrameGroup(frameGroup: FrameGroup): SchemeBuilderScriptFrameGroup;
    addLaneGroup(laneGroup: LaneGroup): SchemeBuilderScriptLaneGroup;
    addCategory(name: string): SchemeBuilderCategory;
    build(): Scheme;
}

interface SchemeBuilderScriptFrameGroup {
    addFrame(frame: Frame): SchemeBuilderScriptFrameGroup;
    addFrameGroup(frameGroup: FrameGroup): SchemeBuilderScriptFrameGroup;
    addLaneGroup(laneGroup: LaneGroup): SchemeBuilderScriptLaneGroup;
    addCategory(name: string): SchemeBuilderCategory;
    build(): Scheme;
}

interface SchemeBuilderScriptLaneGroup {
    addLane(lane: Lane): SchemeBuilderScriptLaneGroup;
    addLaneGroup(laneGroup: LaneGroup): SchemeBuilderScriptLaneGroup;
    addFrameGroup(frameGroup: FrameGroup): SchemeBuilderScriptFrameGroup;
    addCategory(name: string): SchemeBuilderCategory;
    build(): Scheme;
}

export class SchemeBuilder
    implements
        SchemeBuilderStart,
        SchemeBuilderCategory,
        SchemeBuilderScriptStart,
        SchemeBuilderScriptFrameGroup,
        SchemeBuilderScriptLaneGroup
{
    private readonly scheme: Scheme;
    private currentCategory?: Category;
    private currentScript?: Script;
    private currentFrameGroup?: FrameGroup;
    private currentLaneGroup?: LaneGroup;

    private constructor(name: string) {
        this.scheme = { name, categories: [] };
    }

    static create(name: string): SchemeBuilderStart {
        return new SchemeBuilder(name);
    }

    addCategory(name: string): SchemeBuilderCategory {
        this.finalizePendingItems();
        this.currentCategory = {
            name,
            assets: [],
            constructs: [],
            scripts: [],
        };
        return this;
    }

    addAsset(asset: Asset): SchemeBuilderCategory {
        this.ensureCategoryExists();
        this.currentCategory!.assets.push(asset);
        return this;
    }

    addConstruct(construct: Construct): SchemeBuilderCategory {
        this.ensureCategoryExists();
        this.currentCategory!.constructs.push(construct);
        return this;
    }

    addScript(script: Script): SchemeBuilderScriptStart {
        this.ensureCategoryExists();
        this.currentScript = { ...script, frameGroups: [], laneGroups: [] };
        this.currentCategory!.scripts.push(this.currentScript);
        return this;
    }

    addFrameGroup(frameGroup: FrameGroup): SchemeBuilderScriptFrameGroup {
        this.ensureScriptExists();
        this.currentFrameGroup = { ...frameGroup, frames: [] };
        if(this.currentScript!.frameGroups === undefined) {
            this.currentScript!.frameGroups = [];
        }
        this.currentScript!.frameGroups.push(this.currentFrameGroup);
        this.currentLaneGroup = undefined; // Disallow adding lanes in this context
        return this;
    }

    addFrame(frame: Frame): SchemeBuilderScriptFrameGroup {
        this.ensureFrameGroupExists();
        this.currentFrameGroup!.frames.push(frame);
        return this;
    }

    addLaneGroup(laneGroup: LaneGroup): SchemeBuilderScriptLaneGroup {
        this.ensureScriptExists();
        this.currentLaneGroup = { ...laneGroup, lanes: [] };
        if(this.currentScript!.laneGroups === undefined) {
            this.currentScript!.laneGroups = [];
        }
        this.currentScript!.laneGroups.push(this.currentLaneGroup);
        this.currentFrameGroup = undefined; // Disallow adding frames in this context
        return this;
    }

    addLane(lane: Lane): SchemeBuilderScriptLaneGroup {
        this.ensureLaneGroupExists();
        if(!this.currentLaneGroup!.lanes) {
            this.currentLaneGroup!.lanes = [];
        }
        this.currentLaneGroup!.lanes.push(lane);
        return this;
    }

    private finalizePendingItems(): void {
        if (this.currentCategory) {
            this.scheme.categories.push(this.currentCategory);
            this.currentCategory = undefined;
        }
        this.currentScript = undefined;
        this.currentFrameGroup = undefined;
        this.currentLaneGroup = undefined;
    }

    private ensureCategoryExists(): void {
        if (!this.currentCategory) {
            throw new Error("Cannot add elements without a category. Call addCategory() first.");
        }
    }

    private ensureScriptExists(): void {
        if (!this.currentScript) {
            throw new Error("Cannot add elements without a script. Call addScript() first.");
        }
    }

    private ensureFrameGroupExists(): void {
        if (!this.currentFrameGroup) {
            throw new Error("Cannot add frames without a frame group. Call addFrameGroup() first.");
        }
    }

    private ensureLaneGroupExists(): void {
        if (!this.currentLaneGroup) {
            throw new Error("Cannot add lanes without a lane group. Call addLaneGroup() first.");
        }
    }

    build(): Scheme {
        this.finalizePendingItems();
        return this.scheme;
    }
}