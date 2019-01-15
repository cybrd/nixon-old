import * as React from 'react';
import { useContext } from 'react';
import { Link } from 'react-router-dom';

import { List, ListItem } from '@material-ui/core';
import styled from 'styled-components';

import { AuthContext } from '../context/auth';

export function Menu() {
  const authContext = useContext(AuthContext);

  function handleLogout(logout: Function) {
    return () => {
      logout();
    };
  }

  function ListItemLink(props: any) {
    return <ListItem button component={Link} {...props} />;
  }

  const MenuWrapper = styled.div`
    width: 200px;
  `;

  return (
    <MenuWrapper>
      <List>
        {authContext.role && (
          <React.Fragment>
            <ListItemLink to="/timesheet">Timesheet</ListItemLink>
            <ListItemLink to="/timesheetSchedule">
              Timesheet Schedule
            </ListItemLink>
          </React.Fragment>
        )}

        {authContext.role === 'admin' && (
          <React.Fragment>
            <ListItemLink to="/user">Manage User</ListItemLink>
            <ListItemLink to="/employee">Employee</ListItemLink>
            <ListItemLink to="/schedule">Schedule</ListItemLink>
            <ListItemLink to="/payroll">Payroll</ListItemLink>
            <ListItemLink to="/employeeSchedule">
              Employee Schedule
            </ListItemLink>
            <ListItemLink to="/timesheet/load">Load Timesheet</ListItemLink>
            <ListItemLink to="/employeeSchedule/load">
              Load Employee Schedule
            </ListItemLink>
          </React.Fragment>
        )}

        {authContext.role ? (
          <ListItem button onClick={handleLogout(authContext.logout)}>
            Logout
          </ListItem>
        ) : (
          <ListItemLink to="/login">Login Page</ListItemLink>
        )}
      </List>
    </MenuWrapper>
  );
}
