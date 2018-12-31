import { myFetchJSON } from './myFetch';

export function login(username: string, password: string) {
  return myFetchJSON('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: username,
      password: password
    })
  });
}

export function logout() {
  fetch('/api/auth/logout', {
    headers: { pragma: 'no-cache', 'cache-control': 'no-cache' }
  });
}
