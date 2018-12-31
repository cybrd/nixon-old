import { myFetchJSON } from './myFetch';

export function list(args = {}) {
  return myFetchJSON('/api/schedule/list', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(args)
  });
}

export function create(data: any) {
  return myFetchJSON('/api/schedule/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
}

export function update(id: string, data: any) {
  return myFetchJSON('/api/schedule/' + id + '/update', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
}
