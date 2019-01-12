import * as React from 'react';
import { useState } from 'react';

import {
  Table as MTable,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  TablePagination,
  Paper
} from '@material-ui/core';

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
            <TableCell
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
            </TableCell>
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

export function Table(props: any) {
  const [order, setOrder] = useState(props.order || 'asc');
  const [orderBy, setOrderBy] = useState(props.orderBy || '_id');
  const [data] = useState(props.data);
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;

  function handleRequestSort(event: any, property: any) {
    const isDesc = orderBy === property && order === 'desc';
    setOrder(isDesc ? 'asc' : 'desc');
    setOrderBy(property);
  }

  function handleChangePage(event: any, newPage: any) {
    setPage(newPage);
  }

  return (
    <Paper>
      <MTable>
        <EnhancedTableHead
          columns={props.columns}
          order={order}
          orderBy={orderBy}
          onRequestSort={handleRequestSort}
        />
        <TableBody>
          {stableSort(data, getSorting(order, orderBy))
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((row: any, index: number) => {
              return (
                <TableRow
                  hover
                  key={row._id}
                  selected={index % 2 ? false : true}
                >
                  {props.columns.map((column: any) => {
                    if (column.cell) {
                      return (
                        <TableCell
                          key={row._id.concat(column.label, column.field)}
                        >
                          {column.cell(row[column.field], row)}
                        </TableCell>
                      );
                    } else {
                      return (
                        <TableCell key={row._id.concat(column.field)}>
                          {row[column.field]}
                        </TableCell>
                      );
                    }
                  })}
                </TableRow>
              );
            })}
        </TableBody>
      </MTable>

      <TablePagination
        component="div"
        count={data.length}
        rowsPerPageOptions={[]}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
      />
    </Paper>
  );
}
