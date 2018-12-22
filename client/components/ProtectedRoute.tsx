import * as React from 'react';
import { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';

import { AuthContext } from '../context/Auth';

export function ProtectedRoute(props: any) {
  const authContext = useContext(AuthContext);

  if (authContext.role) {
    return <Route {...props} />;
  } else {
    return <Redirect to="/login" />;
  }
}
