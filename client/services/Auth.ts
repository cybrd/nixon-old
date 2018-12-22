import { MyFetchJSON } from './MyFetch';

export function authLogin(username: string, password: string) {
  return MyFetchJSON('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: username,
      password: password
    })
  });
}

export function authLogout() {
  fetch('/api/auth/logout', {
    headers: { pragma: 'no-cache', 'cache-control': 'no-cache' }
  });
}
