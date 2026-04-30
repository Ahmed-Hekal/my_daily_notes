# Modular JavaScript Structure

The application has been refactored into a modular ES6 structure for better maintainability and organization.

## Module Structure

### `/js/app.js`
**Main Application Entry Point**
- Initializes the application
- Coordinates loading of data and rendering
- Sets up event listeners

### `/js/state.js`
**State Management**
- Manages application state (boards, current board ID)
- Provides functions to get/set state
- Handles state mutations in a centralized way

### `/js/dataService.js`
**Database Operations Wrapper**
- Wraps all IPC calls to the database
- Provides clean async API for database operations
- Handles error logging

### `/js/utils.js`
**Utility Functions**
- `generateId()` - Creates unique IDs
- `escapeHtml()` - Sanitizes HTML
- `formatStatus()` - Formats status strings for display

### `/js/modals.js`
**Modal Management**
- Controls showing/hiding modals
- Handles modal form resets

### `/js/boardRenderer.js`
**Board View Rendering**
- Renders the boards list
- Handles board view navigation
- Controls board list display

### `/js/taskRenderer.js`
**Task View Rendering**
- Renders tasks within a board
- Generates task card HTML
- Manages task display state

### `/js/boardActions.js`
**Board CRUD Operations**
- Create new boards
- Delete boards
- Handles board-specific business logic

### `/js/taskActions.js`
**Task CRUD Operations**
- Create new tasks
- Delete tasks
- Handles task-specific business logic

### `/js/taskEditor.js`
**Task Editing Functionality**
- Enable/disable edit mode for tasks
- Save task description changes
- Cancel editing operations

### `/js/dragDrop.js`
**Drag and Drop Functionality**
- Handles all drag and drop events
- Manages task reordering
- Updates task positions in database

### `/js/eventHandlers.js`
**Event Handler Coordination**
- Attaches all event listeners
- Routes events to appropriate handlers
- Manages event delegation

## Benefits of This Structure

1. **Separation of Concerns**: Each module has a single, well-defined responsibility
2. **Maintainability**: Easy to find and modify specific functionality
3. **Testability**: Individual modules can be tested independently
4. **Scalability**: Easy to add new features without affecting existing code
5. **Code Reusability**: Modules can be reused across different parts of the application

## How It Works

The application uses ES6 modules with `import`/`export` syntax:
- Each file exports specific functions or constants
- Other modules import what they need
- The main `app.js` orchestrates everything
- The `index.html` loads `app.js` as a module using `<script type="module">`

## Backup

The original monolithic `renderer.js` has been preserved as `renderer.js.old` for reference.
