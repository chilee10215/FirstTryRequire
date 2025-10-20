# Work Item Management System

This frontend application provides a comprehensive work item management system with the following features:

## Features

### Authentication

- User login and registration
- Automatic redirect to dashboard after successful authentication
- Logout functionality

### Work Items Dashboard

- View all work items in a table format
- Work items display: ID, Title, Status, Created Time
- Sort by created time (ascending/descending) with visual arrow indicator

### Multi-Selection

- Individual checkboxes for each work item row
- Header checkbox to select/deselect all items
- Visual feedback for selected items

### Status Management

- Three work item statuses: `created`, `pending`, `confirmed`
- New work items start with `created` status
- Checking a work item changes its status to `pending`
- Unchecking a work item changes its status back to `created`
- Confirmed items show `confirmed` status and cannot be selected
- Withdraw functionality changes confirmed items back to `created`

### Actions

- **Confirm Button**: Updates selected work items to `confirmed` status
  - Only enabled when at least one item is selected
  - Shows loading state during update
  - Displays success message with count of confirmed items
- **Cancel Button**: Reverts table to original state (unchecks all items)
- **Withdraw Button**: Appears for confirmed work items
  - Shows confirmation popup before withdrawing
  - Changes confirmed items back to `created` status
  - Button disappears after successful withdrawal

### Pagination

- Display 10, 20, or 50 work items per page
- Page navigation with Previous/Next buttons
- Page number buttons with smart pagination (shows up to 5 page numbers)
- Items per page selector with small buttons (10, 20, 50)
- Responsive design that works on mobile and desktop

### Error Handling

- Network error messages
- Failed update notifications
- Automatic state restoration on errors

## File Structure

```
src/
├── types/
│   └── workItem.ts           # TypeScript interfaces for work items
├── services/
│   ├── workItemService.ts    # API service for backend communication
│   └── mockWorkItemService.ts # Mock service for testing/demo
├── components/
│   └── WorkItemsTable.tsx    # Main work items table component
└── app/
    ├── page.tsx              # Login/registration page
    └── dashboard/
        └── page.tsx          # Main dashboard with work items
```

## Usage

1. **Login**: Enter username and password, or create a new account
2. **View Work Items**: After login, you'll see the work items table with pagination
3. **Select Items**: Use checkboxes to select work items (changes status to pending)
4. **Confirm**: Click "Confirm" to update selected items to confirmed status
5. **Cancel**: Click "Cancel" to revert changes and uncheck all items
6. **Withdraw**: Click "Withdraw" on confirmed items to change them back to created
7. **Sort**: Click the arrow next to "Created Time" to toggle sort order
8. **Paginate**: Use pagination controls to navigate through work items (10/20/50 per page)

## Development Notes

- Currently uses mock data service for testing
- To connect to real backend, replace `mockWorkItemService` with `workItemService` in `WorkItemsTable.tsx`
- Backend endpoints expected:
  - `GET /api/workitems` - Fetch all work items
  - `PUT /api/workitems/update-status` - Update work item statuses

## Mock Data

The mock service includes sample work items with different statuses for testing:

- Fix login validation bug (created)
- Implement user dashboard (created)
- Add work item status tracking (pending)
- Update API documentation (confirmed)
- Optimize database queries (created)

## Styling

Uses Tailwind CSS for responsive design with:

- Clean table layout
- Status badges with color coding
- Interactive buttons with hover states
- Loading and disabled states
- Success/error message styling
