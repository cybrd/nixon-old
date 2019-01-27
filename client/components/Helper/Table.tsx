import * as React from 'react';
import { useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import styled from 'styled-components';

import {
  Table as MTable,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  TablePagination,
  Paper,
  CircularProgress
} from '@material-ui/core';

import { ButtonCopyClipboard } from './ButtonCopyClipboard';

const MyPaper = withStyles({
  root: {
    position: 'relative'
  }
})(Paper);

const MyCircularProgress = withStyles({
  root: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -28,
    marginLeft: -28
  }
})(CircularProgress);

const MyTableCell = withStyles({
  root: {
    padding: '2px 28px 2px 12px'
  }
})(TableCell);

const MyTableRow = withStyles({
  root: {
    height: '36px',
    '&:hover': {
      'background-color': 'lightblue !important'
    }
  },
  selected: {
    'background-color': 'aliceblue !important'
  }
})(TableRow);

function EnhancedTableHead(props: any) {
  const { order, orderBy, onRequestSort } = props;

  const createSortHandler = (property: any) => (event: any) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {props.columns.map((column: any) => {
          return (
            <MyTableCell
              key={'th'.concat(column.label)}
              sortDirection={orderBy === column.field ? order : false}
            >
              <TableSortLabel
                active={orderBy === column.field}
                direction={order}
                onClick={createSortHandler(column.field)}
              >
                {column.label}
              </TableSortLabel>
            </MyTableCell>
          );
        })}
      </TableRow>
    </TableHead>
  );
}

function stableSort(array: any, cmp: any) {
  const stabilizedThis = array.map((el: any, index: any) => [el, index]);
  stabilizedThis.sort((a: any, b: any) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el: any) => el[0]);
}

function desc(a: any, b: any, orderBy: any) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getSorting(order: any, orderBy: any) {
  return order === 'desc'
    ? (a: any, b: any) => desc(a, b, orderBy)
    : (a: any, b: any) => -desc(a, b, orderBy);
}

function filterByValue(
  rawData: any[],
  searchString: string,
  columns: string[]
) {
  if (searchString != null) {
    return rawData.filter(
      (v: any) =>
        columns.filter((k: any) =>
          v[k].toLowerCase().includes(searchString.toLowerCase())
        ).length
    );
  } else {
    return rawData;
  }
}

export function Table(props: any) {
  const [orderBy, setOrderBy] = useState(props.orderBy || '_id');
  const [order, setOrder] = useState(props.order || 'asc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(
    parseInt(localStorage.getItem('rowsPerPage'), 10) || 10
  );
  let data = filterByValue(props.data, props.search, props.searchColumns);
  data = stableSort(data, getSorting(order, orderBy));

  function handleRequestSort(event: any, property: any) {
    const isDesc = orderBy === property && order === 'desc';
    setOrder(isDesc ? 'asc' : 'desc');
    setOrderBy(property);
  }

  function handleChangePage(event: any, newPage: any) {
    setPage(newPage);
  }

  function handleChangeRowsPerPage(event: any) {
    localStorage.setItem('rowsPerPage', event.target.value);
    setRowsPerPage(event.target.value);
  }

  return (
    <MyPaper>
      {props.loading && <MyCircularProgress />}
      <MTable>
        <EnhancedTableHead
          columns={props.columns}
          order={order}
          orderBy={orderBy}
          onRequestSort={handleRequestSort}
        />
        <TableBody>
          {data
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((row: any, index: number) => {
              return (
                <MyTableRow
                  hover
                  key={row._id}
                  selected={index % 2 ? false : true}
                >
                  {props.columns.map((column: any) => {
                    if (column.cell) {
                      return (
                        <MyTableCell
                          key={row._id.concat(column.label, column.field)}
                        >
                          {column.cell(row[column.field], row)}
                        </MyTableCell>
                      );
                    } else {
                      return (
                        <MyTableCell key={row._id.concat(column.field)}>
                          {row[column.field]}
                        </MyTableCell>
                      );
                    }
                  })}
                </MyTableRow>
              );
            })}
        </TableBody>
      </MTable>

      <TablePagination
        component={MyTablePagination(data, props.columns, props.copycolumns)}
        count={data.length}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25, 50, 100]}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </MyPaper>
  );
}

function MyTablePagination(data: any, columns: any, copycolumns: string[]) {
  return (props: any) => {
    const MyDiv = styled.div`
      min-width: 100%;
      display: grid;
      grid-template-columns: 1fr 1fr;
    `;

    const MyDivChild = styled.div`
      align-self: center;
    `;

    return (
      <MyDiv>
        <MyDivChild>
          {copycolumns && copycolumns.length && (
            <ButtonCopyClipboard
              data={data}
              columns={columns}
              copycolumns={copycolumns}
            >
              Copy to Clipboard
            </ButtonCopyClipboard>
          )}
        </MyDivChild>
        <div>{props.children}</div>
      </MyDiv>
    );
  };
}

export function readableTime(value: number) {
  value /= 1000;
  const hours = Math.floor(value / 60 / 60);
  value -= hours * 60 * 60;
  const minutes = Math.floor(value / 60);
  value -= minutes * 60;
  const seconds = value;

  const result: string[] = [];

  if (hours) {
    result.push(`${hours} hours`);
  }

  if (minutes) {
    result.push(`${minutes} minutes`);
  }

  if (seconds) {
    result.push(`${seconds} seconds`);
  }

  return result.join(' ');
}
