import {ConstructShape, PermissionAction, SchemeBuilder} from "../../scheme/";

describe('SchemeBuilder', () => {
    it('should build a valid scheme for event modeling', () => {
        const builder = SchemeBuilder.create('Scheme Test');
        let asset = {
            label: 'Asset test',
            type: 'AssetTest',
            description: 'Represents an test asset.',
            icon: 'trigger-icon.png',
            dataSource: 'asset-source',
        };
        const scheme = builder
            .addCategory('first category')
            .addAsset(asset)
            .addScript({
                label: 'Script Tests',
                type: 'ScriptTest',
                description: 'Represents a test script.',
                icon: 'script-icon.png',
                style: {
                    backgroundColor: 'lightblue',
                    borderColor: 'blue',
                    borderStyle: 'solid',
                },
                frameGroups: [
                    {
                        label: 'Frame Group1',
                        permissions: { actions: [PermissionAction.ADD, PermissionAction.REORDER] },
                        countLimits: { min: 0, max: Infinity },
                        frames: [
                            {
                                name: 'FrameGroup1',
                                allowedEntities: [],
                                permissions: { actions: [PermissionAction.ADD] },
                                countLimits: { min: 0, max: Infinity },
                                style: { backgroundColor: 'yellow' },
                            },
                        ],
                    },
                ],
                laneGroups: [
                    {
                        permissions: { actions: [PermissionAction.ADD, PermissionAction.REMOVE] },
                        countLimits: { min: 1, max: 3 },
                        lanes: [
                            {
                                label: 'Lane 1',
                                icon: 'lane-icon.png',
                                allowedEntities: [asset, 'AssetTest2'],
                                countLimits: { min: 0, max: 2 },
                                allowMultipleEntities: true,
                                permissions: { actions: [ PermissionAction.ALL] },
                                style: { backgroundColor: 'lightgreen' },
                            },
                        ],
                    },
                ],
            })
            .addCategory('Commands')
            .addConstruct({
                label: 'Command Construct',
                type: 'commandTest',
                description: 'Represents a test Command.',
                backgroundColor: 'white',
                textColor: 'black',
                shape: ConstructShape.RECTANGLE,
            })
            .build();

        expect(scheme.name).toBe('Scheme Test');
        expect(scheme.categories).toHaveLength(2);

        const triggersCategory = scheme.categories[0];
        expect(triggersCategory.name).toBe('first category');
        expect(triggersCategory.assets).toHaveLength(1);
        expect(triggersCategory.scripts).toHaveLength(1);
        const commandsCategory = scheme.categories[1];
        expect(commandsCategory.name).toBe('Commands');
        expect(commandsCategory.constructs).toHaveLength(1);
    });
});