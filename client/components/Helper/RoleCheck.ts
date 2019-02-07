import { useContext } from 'react';

import { AuthContext } from '../../context/auth';

export function RoleCheck(role: string) {
  const authContext = useContext(AuthContext);

  switch (role) {
    case 'supervisor':
      if (authContext.role === 'admin' || authContext.role === 'supervisor') {
        return true;
      } else {
        return false;
      }
    case 'admin':
    default:
      if (authContext.role === 'admin') {
        return true;
      } else {
        return false;
      }
  }
}

export function RoleCheckX(props: any) {
  const authContext = useContext(AuthContext);

  switch (props.role) {
    case 'supervisor':
      if (authContext.role === 'admin' || authContext.role === 'supervisor') {
        return props.children;
      } else {
        return '';
      }
    case 'admin':
    default:
      if (authContext.role === 'admin') {
        return props.children;
      } else {
        return '';
      }
  }
}
