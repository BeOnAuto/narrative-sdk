# Narrative SDK

[![npm version](https://badge.fury.io/js/narrative-studio-sdk.svg)](https://www.npmjs.com/package/narrative-studio-sdk)

The Narrative SDK provides an interface for interacting with Narrative Studio. It enables you to manage entities, handle events, and maintain a responsive read model, leveraging CQRS (Command Query Responsibility Segregation) for better scalability and performance.

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
  - `name` - Organization’s name. 
  - `website` - Organization’s website URL.
  - `supportUrl` - URL for app support.
- `settings` (optional) - The settings that the app will make available to users in the Narrative Studio. The settings saved by the user are available to the app via the SDK.
- `fields` - The fields that the app will make available to users in the Narrative Studio
    - `name` - A unique name for the field.
    - `label` - The label of the field as it will appear in the Narrative Studio.
    - `type` - The type of the field. Supported types are `text`, `number`, `boolean`.
    - `description` - The description of the field as it will appear in the Narrative Studio.
    - `required` - Whether the field is required or not.
    - `default` (optional) - The default value of the field.

## Usage

The Narrative SDK leverages **CQRS** (Command Query Responsibility Segregation) to manage application state efficiently, separating the command (write) and query (read) sides for better scalability and performance. Here’s how to use its core features:

### 1. Initialize the SDK

Start by importing and initializing the SDK. This gives you access to event handling, command sending, and data querying.


```typescript
import {Narrative} from 'narrative-studio-sdk';

```

### 2. Create Scheme

The createScheme method in the Narrative SDK allows you to define and register a custom Scheme with Narrative Studio. A Scheme represents the structure of your model, consisting of Categories, Assets, Constructs, Scripts, and more.

You can either:
1.	Hand-craft the Scheme object manually.
2.	Use the optional SchemeBuilder to construct it programmatically.

Both approaches are supported, but the SchemeBuilder simplifies the process for complex Schemes.

Example: Modeling an E-Commerce System
```typescript
import {
  SchemeBuilder,
  ConstructShape,
  PermissionAction,
  Narrative,
} from 'narrative-studio-sdk';

// Define entities
const ProductEntity = {
  label: 'Product Entity',
  type: 'product',
  description: 'Represents a product in the system.',
  backgroundColor: '#FFFAE0',
  textColor: '#000000',
  shape: ConstructShape.RECTANGLE,
};

const OrderEntity = {
  label: 'Order Entity',
  type: 'order',
  description: 'Represents a customer order.',
  backgroundColor: '#E8F5E9',
  textColor: '#1B5E20',
  shape: ConstructShape.SQUARE,
};

const UserEntity = {
  label: 'User Entity',
  type: 'user',
  description: 'Represents a user or customer in the system.',
  backgroundColor: '#E3F2FD',
  textColor: '#0D47A1',
  shape: ConstructShape.RECTANGLE,
};

// Create a Scheme using the builder
const ecommerceScheme = SchemeBuilder.create('E-Commerce System')
        .addCategory('Products')
        .addAsset({
          label: 'Product Catalog',
          type: 'catalog',
          description: 'The catalog of all available products.',
          icon: 'https://example.com/catalog-icon.png',
          dataSource: 'products',
        })
        .addConstruct(ProductEntity) // Add Product Entity to the constructs
        .addScript({
          label: 'Inventory Workflow',
          type: 'script',
          description: 'Manages product inventory updates.',
          icon: 'https://example.com/script-icon.png',
          style: {
            backgroundColor: '#F3E5F5',
            borderColor: '#AB47BC',
            borderStyle: 'dotted',
          },
        })
        .addFrameGroup({
          label: 'Inventory Updates',
          permissions: { actions: [PermissionAction.ADD, PermissionAction.REMOVE] },
          countLimits: { min: 1, max: Infinity },
        })
        .addFrame({
          name: 'Stock Check',
          allowedEntities: [ProductEntity], // Reuse Product Entity here
          style: {
            backgroundColor: '#FFF9C4',
          },
        })
        .addLaneGroup({
          permissions: { actions: [PermissionAction.ADD, PermissionAction.REORDER] },
          countLimits: { min: 1, max: 1 },
        })
        .addLane({
          label: 'Product Updates',
          icon: 'https://example.com/lane-icon.png',
          allowedEntities: [ProductEntity], // Reuse Product Entity here
          entityLimits: { min: 1, max: 1 },
          style: { backgroundColor: '#C8E6C9' },
        })
        .addCategory('Orders')
        .addConstruct(OrderEntity) // Add Order Entity to the constructs
        .addCategory('Users')
        .addConstruct(UserEntity) // Add User Entity to the constructs
        .build();

// Send the Scheme to Narrative Studio
const response = await Narrative.createScheme(ecommerceScheme);
```


### 2. Send Commands

Commands are used to perform actions that modify the system’s state. They are the primary way to make changes, such as adding, updating, or deleting entities.

**Example: Adding a New Entity**
```typescript
import { Narrative, AddEntityCommand } from 'narrative-studio-sdk';

const sendCommandResponse = await Narrative.sendCommand(AddEntityCommand, {
  id: 'order1',
  type: 'order',
  position: { x: 200, y: 150 },
  name: 'Order #1',
});
```

### 2. Subscribe to events

Events inform your app of changes or interactions occurring within the Narrative Studio. You can subscribe to these events to react to system changes.

**Example: Listening for Changes**
```typescript
Narrative.subscribeToEvents([ChangesSavedEvent], (event: ChangesSavedEvent) => {
    console.log('Changes detected:', event.changes);
});
```

### 3. Update the Read Model

The **Read Model** provides a simplified and optimized view of your data, making it easy to bind to UI components. It allows you to maintain a reactive and up-to-date interface.

You can use the updateReadModel method to add, update, or delete entities in your Read Model.

**Example: Updating the Read Model Based on Events**
```typescript
Narrative.subscribeToEvents([ChangesSavedEvent], (event: ChangesSavedEvent) => {
    // Handle added entities
    event.changes.added
        .filter((entity) => entity.type === 'CustomType') // Filter by type
        .forEach((entity) => {
            narrative.updateReadModel([
                {
                    id: entity.id,
                    type: entity.type,
                    data: entity,
                },
            ]);
        });

    // Handle updated entities
    event.changes.updated
        .filter((update) => update.entity.type === 'CustomType') // Filter by type
        .forEach((update) => {
            narrative.updateReadModel([
                {
                    id: update.entity.id,
                    type: update.entity.type,
                    data: update.entity,
                },
            ]);
        });

    // Handle deleted entities
    event.changes.deleted
        .filter((deleted) => deleted.type === 'CustomType') // Filter by type
        .forEach((deleted) => {
            narrative.updateReadModel((currentState) =>
                currentState.filter((item) => item.id !== deleted.id)
            );
        });
});
```

### 4. Integrate with Your Backend

To create a seamless user experience, you can integrate Narrative SDK with your backend services. This allows you to:
- Store data for persistence or auditing.
- Enrich the read model with additional backend data.
- Trigger backend workflows based on Narrative Studio events.

**Example: Sending Custom Entity Changes to Your Backend**
```typescript
Narrative.subscribeToEvents([ChangesSavedEvent], async (event: ChangesSavedEvent) => {
  const customAddedEntities = event.changes.added.filter(
    (entity) => entity.type === 'CustomType'
  );

  const customUpdatedEntities = event.changes.updated.filter(
    (change) => change.entity.type === 'CustomType'
  );

  const customDeletedEntities = event.changes.deleted.filter(
    (deleted) => deleted.type === 'CustomType'
  );

  if (customAddedEntities.length > 0 || customUpdatedEntities.length > 0 || customDeletedEntities.length > 0) {
    await fetch('https://your-backend-api.com/entity-changes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        added: customAddedEntities,
        updated: customUpdatedEntities,
        deleted: customDeletedEntities,
      }),
    });
  }
});
```




