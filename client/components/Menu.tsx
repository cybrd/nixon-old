import * as React from 'react';
import { useContext } from 'react';
import { Link } from 'react-router-dom';

import { styled } from '../my.styled';

import { AuthContext } from '../context/Auth';

export function Menu() {
  const authContext = useContext(AuthContext);

  function handleLogout(logout: Function) {
    return () => {
      logout();
    };
  }

  const Menu = styled.ul`
    margin: 0;
    width: 200px;
  `;

  return (
    <Menu>
      <li>
        <Link to="/">Home</Link>
      </li>
      <li>
        <Link to="/mongodb">MongoDb</Link>
      </li>
      <li>
        <Link to="/about">About (api call)</Link>
      </li>
      <li>
        <Link to="/topics">Topics (styled)</Link>
      </li>
      <li>
        <Link to="/404">404</Link>
      </li>

      {authContext.role === 'admin' && (
        <li>
          <Link to="/user">Manage User</Link>
        </li>
      )}

      {authContext.role ? (
        <li>
          <a onClick={handleLogout(authContext.logout)}>Logout</a>
        </li>
      ) : (
        <li>
          <Link to="/login">Login</Link>
        </li>
      )}
    </Menu>
  );
}
