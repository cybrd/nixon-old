import * as React from 'react';
import { useContext } from 'react';
import { NavLink } from 'react-router-dom';

import {
  List,
  ListItem,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  withStyles
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import styled from 'styled-components';

import { AuthContext } from '../context/auth';

const MyExpansionPanel = withStyles({
  root: {
    margin: 'auto'
  }
})(ExpansionPanel);

const MyExpansionPanelSummary = withStyles({
  expanded: {
    'min-height': '40px !important',
    'align-items': 'center'
  },
  content: {
    margin: '0 !important'
  }
})(ExpansionPanelSummary);

const MyExpansionPanelDetails = withStyles({
  root: {
    padding: '0 22px'
  }
})(ExpansionPanelDetails);

function MyNavLink(props: any) {
  return (
    <NavLink
      {...props}
      exact
      activeStyle={{
        fontWeight: 'bold',
        color: 'red'
      }}
    >
      {props.children}
    </NavLink>
  );
}

export function Menu() {
  const authContext = useContext(AuthContext);

  function handleLogout(logout: Function) {
    return () => {
      logout();
    };
  }

  function ListItemLink(props: any) {
    return <ListItem button component={MyNavLink} {...props} />;
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
            <ListItemLink to="/timesheetSchedule/summary">
              Timesheet Summary
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
            <MyExpansionPanel>
              <MyExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                Load
              </MyExpansionPanelSummary>
              <MyExpansionPanelDetails>
                <List>
                  <ListItemLink to="/timesheet/load">
                    Load Timesheet
                  </ListItemLink>
                  <ListItemLink to="/employeeSchedule/load">
                    Load Employee Schedules
                  </ListItemLink>
                  <ListItemLink to="/employee/load">
                    Load Employees
                  </ListItemLink>
                </List>
              </MyExpansionPanelDetails>
            </MyExpansionPanel>
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
