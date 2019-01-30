import * as React from 'react';
import { useState, useEffect } from 'react';
import { FormControl, InputLabel, Input } from '@material-ui/core';

import { ButtonLink } from '../Helper/ButtonLink';
import { Table } from '../Helper/Table';
import { Remove } from '../Helper/Remove';
import { Update } from '../Helper/Update';
import { list, removeMany } from '../../services/employee';

export function List() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const search = useFormInput('');
  const columns = [
    {
      label: 'Finger Print Id',
      field: 'fingerPrintId'
    },
    {
      label: 'Name',
      field: 'name'
    },
    {
      label: 'Department',
      field: 'department'
    },
    {
      label: 'Position',
      field: 'position'
    },
    {
      label: 'Actions',
      field: '_id',
      cell: (value: any) => (
        <React.Fragment>
          <Update view="/employee/{{ _id }}" data={{ _id: value }} />
          <Remove view="/api/employee/{{ _id }}/remove" data={{ _id: value }} />
        </React.Fragment>
      )
    }
  ];

  function useFormInput(initialValue: string) {
    const [value, setValue] = useState(initialValue);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
      setValue(e.target.value);
    }

    return {
      value: value,
      onChange: handleChange
    };
  }

  async function fetchData() {
    setLoading(true);
    const tmp = await list();
    setData(tmp);
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <React.Fragment>
      <ButtonLink to="/employee/create" color="primary">
        Create New Employee
      </ButtonLink>
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
        />
      ) : (
        'Loading...'
      )}
    </React.Fragment>
  );
}
