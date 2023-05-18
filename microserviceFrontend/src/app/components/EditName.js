import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';

export function EditName() {
  return (
    <div style={{ height: 300, width: '100%' }}>
      <DataGrid rows={rows} columns={columns} />
    </div>
  );
}

const columns = [
  { field: 'name', headerName: 'Name', width: 100, editable: true },
  { field: 'lastName', headerName: 'Last Name', width: 100, editable: true },
  { field: 'email', headerName: 'Email', width: 150, editable: true }
];

const rows = [{id: 1, name: 'name', lastName: 'lastName', email: 'email'}];