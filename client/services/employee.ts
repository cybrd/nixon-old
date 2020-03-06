import { myFetchJSON, myFetch } from './myFetch';

export function list(args = {}) {
  return myFetchJSON('/api/employee/list', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(args)
  });
}

export function create(data: any) {
  return myFetchJSON('/api/employee/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
}

export function update(id: string, data: any) {
  return myFetch('/api/employee/' + id + '/update', {
    method: 'POST',
    body: data
  });
}

export function upload(file: File) {
  const data = new FormData();
  data.append('file', file);

  return myFetch('/api/employee/upload', {
    method: 'POST',
    body: data
  });
}

export function removeMany(args: any) {
  return myFetchJSON('/api/employee/removeMany', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(args)
  });
}
