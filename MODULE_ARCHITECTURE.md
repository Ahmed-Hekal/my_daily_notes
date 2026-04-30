# Module Dependency Graph

```
┌─────────────────────────────────────────────────────────────┐
│                         index.html                          │
│                    (Entry Point - Loads app.js)             │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │   app.js    │ (Main Initialization)
                    └──────┬──────┘
                           │
           ┌───────────────┼───────────────┐
           ▼               ▼               ▼
    ┌─────────────┐ ┌─────────────┐ ┌──────────────┐
    │dataService.js│ │boardRenderer│ │eventHandlers │
    │             │ │    .js      │ │     .js      │
    └──────┬──────┘ └──────┬──────┘ └──────┬───────┘
           │               │               │
           │               │               └────────────┐
           │               │                            │
           ▼               ▼                            ▼
    ┌────────────┐  ┌─────────────┐         ┌──────────────────┐
    │  state.js  │  │taskRenderer │         │   modals.js      │
    │  (Shared)  │  │    .js      │         │                  │
    └──────▲─────┘  └──────┬──────┘         └──────────────────┘
           │               │
           │               │
    ┌──────┴───────────────┴────────────┬──────────────┬──────────┐
    │                                   │              │          │
    ▼                                   ▼              ▼          ▼
┌─────────────┐                  ┌────────────┐  ┌────────┐  ┌────────┐
│boardActions │                  │taskActions │  │taskEdit│  │dragDrop│
│    .js      │                  │    .js     │  │ or.js  │  │  .js   │
└─────────────┘                  └────────────┘  └────────┘  └────────┘
    │                                   │              │          │
    └───────────────┬───────────────────┴──────────────┴──────────┘
                    │
                    ▼
             ┌─────────────┐
             │  utils.js   │ (Shared Utilities)
             └─────────────┘


Module Responsibilities:
━━━━━━━━━━━━━━━━━━━━━━━━

app.js              → Main coordinator, initializes everything
state.js            → Centralized state management
dataService.js      → Database communication layer
utils.js            → Utility functions (generateId, escapeHtml, etc.)
modals.js           → Modal show/hide/reset logic
boardRenderer.js    → Board list and navigation rendering
taskRenderer.js     → Task cards rendering
boardActions.js     → Board CRUD operations
taskActions.js      → Task CRUD operations
taskEditor.js       → Task description editing
dragDrop.js         → Drag & drop task reordering
eventHandlers.js    → Event listener coordination
```

## Data Flow Example

**Creating a New Task:**
```
User clicks "Create Task"
        ↓
eventHandlers.js (handles click)
        ↓
modals.js (shows modal)
        ↓
User submits form
        ↓
eventHandlers.js (handles submit)
        ↓
taskActions.js (processes form data)
        ↓
dataService.js (saves to database)
        ↓
state.js (updates local state)
        ↓
taskRenderer.js (re-renders tasks)
```

**Editing a Task:**
```
User clicks "Edit" button
        ↓
eventHandlers.js (routes to editor)
        ↓
taskEditor.js (enables edit mode)
        ↓
User modifies description and clicks "Save"
        ↓
taskEditor.js (validates and saves)
        ↓
dataService.js (updates database)
        ↓
state.js (updates local state)
        ↓
taskRenderer.js (re-renders tasks)
```
