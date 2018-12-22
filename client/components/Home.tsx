import * as React from 'react';
import { useContext } from 'react';

import { AuthContext } from '../context/Auth';

export function Home() {
  const authContext = useContext(AuthContext);

  return (
    <div>
      Home
      {authContext.role && <p>{authContext.username}</p>}
    </div>
  );
}
