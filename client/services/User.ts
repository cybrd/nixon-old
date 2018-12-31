import { myFetchJSON } from './myFetch';

export function list(args = {}) {
  return myFetchJSON('/api/user/list', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(args)
  });
}

export function create(username: string, password: string, role: string) {
  return myFetchJSON('/api/user/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: username,
      password: password,
      role: role
    })
  });
}
