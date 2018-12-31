import { myFetchJSON } from './myFetch';

export function list(args = {}) {
  return myFetchJSON('/api/user/list', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(args)
  });
}

export function create(data: any) {
  return myFetchJSON('/api/user/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
}

export function update(id: string, data: any) {
  return myFetchJSON('/api/user/' + id + '/update', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
}
