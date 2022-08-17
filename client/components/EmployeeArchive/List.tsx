import * as React from 'react';
import { useState, useEffect } from 'react';
import { FormControl, InputLabel, Input } from '@material-ui/core';
import * as moment from 'moment';

import { Table } from '../Helper/Table';
import { listArchive, removeMany } from '../../services/employee';

export function List() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const search = useFormInput('');
  const columns = [
    {
      label: 'Finger Print Id',
      field: 'fingerPrintId',
    },
    {
      label: 'Name',
      field: 'name',
    },
    {
      label: 'Age',
      field: 'age',
      cell: (value: any, row: any) => {
        if (row.birthDate) {
          const ageDifMs =
            Date.now() - new Date(row.birthDate.substr(0, 10)).getTime();
          const ageDate = new Date(ageDifMs);
          return Math.abs(ageDate.getUTCFullYear() - 1970).toString();
        } else {
          return '';
        }
      },
    },
    {
      label: 'Department',
      field: 'department',
    },
    {
      label: 'Position',
      field: 'position',
    },
    {
      label: 'Term',
      field: 'hireDate',
      cell: (value: any) => {
        if (value) {
          const ends = moment();
          const starts = moment(value.substr(0, 10));
          const years = ends.diff(starts, 'years');
          const months = ends.diff(starts, 'months');

          let returnString = '';
          if (years) {
            returnString += `${years} years `;
          }
          const modMonths = months % 12;
          if (modMonths) {
            returnString += `${modMonths} months `;
          }

          return returnString || '0 month';
        } else {
          return '';
        }
      },
    },
    {
      label: 'SSS / Phil Health / Pag-Ibig',
      field: 'SSSphilHealthpagIbig',
      cell: (value: any, row: any) => (
        <React.Fragment>
          <p>SSS: {row.SSS}</p>
          <p>Phil Health: {row.philHealth}</p>
          <p>Pag-Ibig: {row.pagIbig}</p>
        </React.Fragment>
      ),
    },
    {
      label: 'Address',
      field: 'address',
    },
    {
      label: 'Photo',
      field: 'photo',
      cell: (value: any) => {
        if (value) {
          const photo = '/photo/' + value;
          return <img src={photo} style={{ maxWidth: 100, maxHeight: 100 }} />;
        }
      },
    },
    {
      field: 'SSS',
      show: false,
    },
    {
      field: 'philHealth',
      show: false,
    },
    {
      field: 'pagIbig',
      show: false,
    },
  ];
  const copycolumns = [
    'fingerPrintId',
    'name',
    'department',
    'position',
    'hireDate',
    'SSS',
    'philHealth',
    'pagIbig',
    'address',
  ];

  function useFormInput(initialValue: string) {
    const [value, setValue] = useState(initialValue);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
      setValue(e.target.value);
    }

    return {
      value: value,
      onChange: handleChange,
    };
  }

  async function fetchData() {
    setLoading(true);
    const tmp = await listArchive();
    setData(tmp);
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <React.Fragment>
      <form>
        <FormControl fullWidth>
          <InputLabel>Search</InputLabel>
          <Input {...search} />
        </FormControl>
      </form>
      {data != null ? (
        <Table
          data={data}
          columns={columns}
          loading={loading}
          search={search.value}
          searchColumns={['fingerPrintId', 'name', 'department', 'position']}
          removeFn={removeMany}
          copycolumns={copycolumns}
        />
      ) : (
        'Loading...'
      )}
    </React.Fragment>
  );
}
