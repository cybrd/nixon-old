import { serverURI } from '../constants';
import { myFetchJSON } from './myFetch';

export function login(username: string, password: string) {
  const result = myFetchJSON('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: username,
      password: password,
    }),
  });

  return result;
}

export function logout() {
  return fetch(serverURI + '/api/auth/logout', {
    headers: { pragma: 'no-cache', 'cache-control': 'no-cache' },
  });
}
