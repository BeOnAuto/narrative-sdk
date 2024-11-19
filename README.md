# Narrative SDK

[![npm version](https://badge.fury.io/js/narrative-studio-sdk.svg)](https://www.npmjs.com/package/narrative-studio-sdk)

The Narrative SDK enables you to easily interact with the Narrative Studio through your app. 
The SDK provides methods to interact with the Narrative Studio, such as creating, updating, and deleting entities, as well as subscribing to events and updating the store.

## Installation

Install the SDK using npm or yarn:

```bash
npm install narrative-studio-sdk

# or

yarn add narrative-studio-sdk
``` 

## App Manifest

The App Manifest defines your app, its entities, and settings. It must be hosted on a publicly accessible URL to register the app with Narrative Studio.

### Manifest Example

```json
{
  "name": "My Workflow App",
  "description": "Single source model for workflow management",
  "icon": "https://example.com/icon.png",
  "version": "1.0.0",
  "appUrl": "https://example.com/app.js",
  "vendor": {
    "name": "VendorName",
    "website": "https://vendor.com",
    "supportUrl": "https://vendor.com/support"
  },
  "entities": {
    "constructs": [
      {
        "caption": "Custom Construct",
        "type": "CustomConstruct",
        "backgroundColor": "#C6A2D2",
        "textColor": "#000000",
        "shape": "rectangle"
      }
    ],
    "assets": [
      {
        "caption": "Custom Asset",
        "type": "CustomType",
        "icon": "/custom-asset.svg",
        "dataSource": "custom.dataSource",
        "detailsPane": {
          "url": "https://example.com/details-pane.xml"
        }
      }
    ]
  },
  "settings": {
    "fields": [
      {
        "name": "apiKey",
        "label": "API Key",
        "type": "text",
        "description": "Your personal API key for integration",
        "required": true
      },
      {
        "name": "projectId",
        "label": "Default Project ID",
        "type": "number",
        "description": "The ID of your default project",
        "required": false
      },
      {
        "name": "enableNotifications",
        "label": "Enable Notifications",
        "type": "boolean",
        "description": "Turn on/off notifications",
        "required": false,
        "default": true
      }
    ]
  }
}
```

### Fields Description

- `name` - App display name in Narrative Studio.
- `description` - Description shown in Narrative Studio.
- `icon` - URL for the app icon.
- `version` - App version.
- `appUrl` - Public URL of the app’s JavaScript file.
- `vendor` - 
  - `name` - Organization’s name 
  - `website` - Organization’s website URL
  - `supportUrl` - URL for app support.
- `entities` Configurable building blocks in Narrative Studio.
    - `constructs` (optional) - Define new constructs for users.
        - `type` - The type of the construct.
        - `caption` - The caption of the construct.
        - `backgroundColor` - Hex Color code for the background color of the construct.
        - `textColor` - Hex Color code for the text color.
        - `shape` - The shape of the construct. Supported shapes are `rectangle` and `square`.
        - `url` (optional) -  A URL to an XML file that describes the details pane for the asset. The details pane is a custom view that appears when the asset is clicked on in the Narrative Studio
    - `assets` (optional) - Define new assets for users. Assets are reusable resources which can be referenced in one or more constructs.
        - `caption` - The caption of the asset.
        - `type` - The type of the asset.
        - `icon` - The URL to the icon of the asset.
        - `dataSource` - Key to bind the asset to the read model.
        - `detailsPane` 
        - `url` (optional) -  A URL to an XML file that describes the details pane for the asset. The details pane is a custom view that appears when the asset is clicked on in the Narrative Studio.
- `settings` (optional) - The settings that the app will make available to users in the Narrative Studio. The settings saved by the user are available to the app via the SDK.
- `fields` - The fields that the app will make available to users in the Narrative Studio
    - `name` - A unique name for the field
    - `label` - The label of the field as it will appear in the Narrative Studio
    - `type` - The type of the field. Supported types are `text`, `number`, `boolean`
    - `description` - The description of the field as it will appear in the Narrative Studio
    - `required` - Whether the field is required or not
    - `default` (optional) - The default value of the field

### Details Pane

The details pane is a custom view that appears when an entity is clicked on in the Narrative Studio. By default, the details pane is a simple view that displays the name of the entity and allows the user to enter a description. 
You can customize the details pane by providing a URL to an XML file that describes the elements you want to appear and optionally bind it's data to a read model. The XML file should be hosted on a publicly accessible network location.

the following elements are supported in the XML file:

- `detailsPane` - The root element of the XML file
- 
- `tabs` (optional) - The tabs that will appear in the details pane.
- `tab` (optional) - A tab that will appear in the details pane.
    - `label` - The label of the tab.
    - `icon` (optional) - The icon of the tab.
- `items` - Items can be under a tab or directly under the `detailsPane`.
  - `item` - An item that will appear in the details pane.
      - `label` - The label of the item.
      - `icon` (optional) - The icon of the item.
      - `type` - The type of the item. Supported types are `textbox`, `textarea`, `select`.
      - `value` - The value that you would like the item to be set to. You can bind items to a read model by enclosing the item in double curley brackets, e.g. {{asset.summary}}. You can use the SDK to update items in the read model.
      - `options` (optional) - for use with the `select` type, the options that will appear in the select dropdown.
      - `option` - An option of the item.
          - `value` - The value of the option.
          - `label` - The label of the option.


### Details Pane Example

The following is an example of a details pane XML file that uses tabs:

```xml
<detailsPane>
    <tabs>
        <tab label="Details">
            <textbox label="Summary" value="{{asset.summary}}" />
            <textbox label="Type" value="{{asset.type}}" />
            <textbox label="Priority" value="{{asset.priority}}" icon="{{asset.priorityIcon}}" />
            <select label="Status" value="{{asset.status}}">
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Closed">Closed</option>
            </select>
        </tab>
        <tab label="Description">
            <textarea value="{{asset.description}}" />
        </tab>
    </tabs>
</detailsPane>

```

Without tabs:

```xml  
<detailsPane>
    <item label="Summary" type="textbox" value="{{asset.summary}}" />
    <item label="Type" type="textbox" value="{{asset.type}}" />
    <item label="Priority" type="textbox" value="{{asset.priority}}" icon="{{asset.priorityIcon}}" />
    <item label="Status" type="select" value="{{asset.status}}">
        <option value="Open">Open</option>
        <option value="In Progress">In Progress</option>
        <option value="Closed">Closed</option>
    </item>
    <item label="Description" type="textarea" value="{{asset.description}}" />
</detailsPane>

```

## Usage

The Narrative SDK leverages **CQRS** (Command Query Responsibility Segregation) to manage application state efficiently, separating the command (write) and query (read) sides for better scalability and performance. Here’s how to use its core features:

### 1. Initialize the SDK

Start by importing and initializing the SDK. This gives you access to event handling, command sending, and data querying.


```typescript
import NarrativeSDK from 'narrative-sdk';

const narrative = new NarrativeSDK();
```

### 2. Send Commands

Commands are used to perform actions that modify the system’s state. They are the primary way to make changes, such as adding, updating, or deleting entities.

**Example: Adding a New Entity**
```typescript
import { AddEntityCommand } from 'narrative-sdk/commands';

narrative.sendCommand(AddEntityCommand, {
  id: 'task-001',
  type: 'Task',
  position: { x: 200, y: 150 },
  name: 'New Task',
});
```

### 2. Subscribe to events

Events inform your app of changes or interactions occurring within the Narrative Studio. You can subscribe to these events to react to system changes.

**Example: Listening for Changes**
```typescript
narrative.subscribeToEvents([ChangesSavedEvent], (event: ChangesSavedEvent) => {
    console.log('Changes detected:', event.changes);
});
```

### 3. Update the Read Model

The **Read Model** provides a simplified and optimized view of your data, making it easy to bind to UI components. It allows you to maintain a reactive and up-to-date interface.

You can use the updateReadModel method to add, update, or delete entities in your Read Model.

**Example: Updating the Read Model Based on Events**
```typescript
narrative.subscribeToEvents([ChangesSavedEvent], (event: ChangesSavedEvent) => {
    event.changes.forEach((change) => {
        narrative.updateReadModel({
            id: change.entity.id,
            type: change.entity.type,
            data: change.entity,
        });
    });
});
```







