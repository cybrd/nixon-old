import * as React from 'react';
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { AuthContext } from '../context/auth';

export function Menu() {
  const authContext = useContext(AuthContext);

  function handleLogout(logout: Function) {
    return () => {
      logout();
    };
  }

  const Ul = styled.ul`
    margin: 0;
    width: 200px;
  `;

  return (
    <Ul>
      {authContext.role && (
        <React.Fragment>
          <li>
            <Link to="/timesheet">Timesheet</Link>
          </li>
          <li>
            <Link to="/timesheetSchedule">Timesheet Schedule</Link>
          </li>
        </React.Fragment>
      )}

      {authContext.role === 'admin' && (
        <React.Fragment>
          <li>
            <Link to="/user">Manage User</Link>
          </li>
          <li>
            <Link to="/employee">Employee</Link>
          </li>
          <li>
            <Link to="/schedule">Schedule</Link>
          </li>
          <li>
            <Link to="/payroll">Payroll</Link>
          </li>
          <li>
            <Link to="/employeeSchedule">Employee Schedule</Link>
          </li>
          <li>
            <Link to="/timesheet/load">Load Timesheet</Link>
          </li>
        </React.Fragment>
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
    </Ul>
  );
}
