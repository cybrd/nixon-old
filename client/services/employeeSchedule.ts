import { myFetchJSON, myFetch } from './myFetch';

export function list(args = {}) {
  return myFetchJSON('/api/employeeSchedule/list', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(args)
  });
}

export function listPopulated(args = {}) {
  return myFetchJSON('/api/employeeSchedule/listPopulated', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(args)
  });
}

export function create(data: any) {
  return myFetchJSON('/api/employeeSchedule/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
}

export function update(id: string, data: any) {
  return myFetchJSON('/api/employeeSchedule/' + id + '/update', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
}

export function upload(file: File) {
  const data = new FormData();
  data.append('file', file);

  return myFetch('/api/employeeSchedule/upload', {
    method: 'POST',
    body: data
  });
}
