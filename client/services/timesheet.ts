import { myFetch, myFetchJSON } from './myFetch';

export function list(args = {}) {
  return myFetchJSON('/api/timesheet/list', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(args)
  });
}

export function create(data: any) {
  return myFetchJSON('/api/timesheet/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
}

export function update(id: string, data: any) {
  return myFetchJSON('/api/timesheet/' + id + '/update', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
}

export function upload(file: File) {
  const data = new FormData();
  data.append('file', file);

  return myFetch('/api/timesheet/upload', {
    method: 'POST',
    body: data
  });
}
