import { serverURI } from '../constants';

export function myFetchJSON(uri: string, options: any = {}, cache = false) {
  if (cache) {
    const tmp1 = getItem(JSON.stringify([uri, options]));

    if (tmp1 !== undefined) {
      return JSON.parse(tmp1);
    }
  }

  return new Promise((resolve, reject) => {
    const token = localStorage.getItem('token') || document.cookie;

    fetch(serverURI + uri, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: 'Bearer ' + token,
      },
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw res.status;
        }
      })
      .then((data) => {
        setItem(JSON.stringify([uri, options]), JSON.stringify(data));
        resolve(data);
      })
      .catch((err) => {
        myResolve(resolve, err);
      });
  });
}

export function myFetch(uri: string, options: any = {}, cache = false) {
  if (cache) {
    const tmp1 = getItem(JSON.stringify([uri, options]));

    if (tmp1 !== undefined) {
      return JSON.parse(tmp1);
    }
  }

  return new Promise((resolve, reject) => {
    const token = localStorage.getItem('token') || document.cookie;

    fetch(serverURI + uri, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: 'Bearer ' + token,
      },
    })
      .then((res) => {
        if (res.ok) {
          return res.text();
        } else {
          throw res.status;
        }
      })
      .then((data) => {
        setItem(JSON.stringify([uri, options]), JSON.stringify(data));
        resolve(data);
      })
      .catch((err) => {
        myResolve(resolve, err);
      });
  });
}

const mycache: any = {};
function setItem(key: string, value: string) {
  mycache[key] = value;
}

function getItem(key: string) {
  return mycache[key];
}

function myResolve(resolve: Function, status: Number) {
  switch (status) {
    case 401:
      localStorage.removeItem('auth');
      window.location.href = '/login';
      break;
  }
}
