import {Asset, ConstructShape, AllowedAction, SchemeBuilder} from '../../scheme/';

describe('SchemeBuilder', () => {
    let asset: Asset;

    beforeEach(() => {
        asset = {
            label: 'Asset test',
            type: 'AssetTest',
            description: 'Represents a test asset.',
            icon: 'trigger-icon.png',
            dataSource: 'asset-source',
        };
    });

    const createBuilderWithCategory = (categoryName: string) =>
        SchemeBuilder.create('Scheme Test').addCategory(categoryName);

    describe('Category Management', () => {
        it('should create a scheme with multiple categories', () => {
            const scheme = createBuilderWithCategory('first category')
                .addCategory('second category')
                .build();

            expect(scheme.name).toBe('Scheme Test');
            expect(scheme.categories).toHaveLength(2);
            expect(scheme.categories[0].name).toBe('first category');
            expect(scheme.categories[1].name).toBe('second category');
        });

        it('should allow adding assets to a category', () => {
            const scheme = createBuilderWithCategory('first category').addAsset(asset).build();

            const triggersCategory = scheme.categories[0];
            expect(triggersCategory.assets).toHaveLength(1);
            expect(triggersCategory.assets[0].label).toBe(asset.label);
        });
    });

    describe('Script and Related Elements', () => {
        it('should allow adding a script with frame groups and lanes to a construct', () => {

            const scheme = createBuilderWithCategory('first category')
                .addConstruct({
                    label: 'Construct Test',
                    type: 'ConstructTest',
                    description: 'Represents a test construct.',
                    style: {backgroundColor: 'white', textColor: 'black'},
                    shape: ConstructShape.RECTANGLE,
                })
                .addScript({
                    type: 'ScriptTest',
                    style: {
                        backgroundColor: 'lightblue',
                        borderColor: 'blue',
                        borderWidth: 1,
                    },
                })
                .addFrameGroup({
                    label: {text: 'Frame Group 1'},
                    allowedActions: {actions: [AllowedAction.ADD, AllowedAction.REORDER]},
                    frameGroupLimits: {min: 0, max: Infinity},
                    frameLimits: {min: 1, max: 3},
                })
                .addFrame(
                    {
                        label: {text: 'Frame 1'},
                        allowedEntities: {type: 'ALL'},
                        style: {backgroundColor: 'yellow'},
                    },
                )
                .addLaneGroup({
                    allowedActions: {actions: [AllowedAction.ADD, AllowedAction.REMOVE]},
                    laneGroupLimits: {min: 3, max: 3},
                    laneLimits: {min: 1, max: 3},
                })
                .addLane({
                    label: {text: 'Lane 1', icon: 'lane-icon.png'},
                    allowedEntities: {type: 'SPECIFIC', entities: [asset, 'AssetTest2']},
                    entityLimits: {min: 0, max: 2},
                    style: {backgroundColor: 'lightgreen'},
                })
                .addConstruct({
                    label: 'Construct Test 2',
                    type: 'ConstructTest2',
                    description: 'Represents a test construct 2.',
                    style: {backgroundColor: 'white', textColor: 'black'},
                    shape: ConstructShape.RECTANGLE,
                })
                .build();

            const triggersCategory = scheme.categories[0];
            expect(triggersCategory.constructs).toHaveLength(2);
            expect(triggersCategory.constructs[0].script).toBeDefined();
            expect(triggersCategory.constructs[1].script).toBeUndefined();
            const script = triggersCategory.constructs[0].script;
            expect(script?.frameGroups?.length).toBe(1);
            expect(script?.laneGroups?.length).toBe(1);
            const frameGroup = script?.frameGroups?.[0] ?? fail('frameGroups is undefined or empty');
            expect(frameGroup.frames?.length).toBe(1);
            expect(frameGroup.frames?.[0]?.label?.text).toBe('Frame 1');
            expect(frameGroup.frames?.[0]?.allowedEntities).toEqual({type: 'ALL'});
            expect(frameGroup.frames?.[0]?.style?.backgroundColor).toBe('yellow');
            const laneGroup = script?.laneGroups?.[0] ?? fail('laneGroups is undefined or empty');
            expect(laneGroup.lanes?.length).toBe(1);
            const lane = laneGroup.lanes?.[0] ?? fail('lanes is undefined or empty');
            expect(lane.label?.text).toBe('Lane 1');
            expect(lane.label?.icon).toBe('lane-icon.png');
            expect(lane.allowedEntities).toEqual({type: 'SPECIFIC', entities: [asset, 'AssetTest2']});
        });
    });

    describe('Validation for Constructs', () => {
        it('should allow adding constructs to a category', () => {
            const scheme = createBuilderWithCategory('Commands')
                .addConstruct({
                    label: 'Command Construct',
                    type: 'commandTest',
                    description: 'Represents a test Command.',
                    style: {backgroundColor: 'white', textColor: 'black'},
                    shape: ConstructShape.RECTANGLE,
                })
                .build();

            const commandsCategory = scheme.categories[0];
            expect(commandsCategory.constructs).toHaveLength(1);
            const construct = commandsCategory.constructs[0];
            expect(construct.label).toBe('Command Construct');
            expect(construct.type).toBe('commandTest');
        });
    });
});