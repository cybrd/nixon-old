import { MyFetchJSON } from './MyFetch';

export function userCreate(username: string, password: string, role: string) {
  return MyFetchJSON('/api/user/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: username,
      password: password,
      role: role
    })
  });
}
