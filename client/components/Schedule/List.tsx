import * as React from 'react';
import { useState, useEffect } from 'react';

import { ButtonLink } from '../Helper/ButtonLink';
import { Table } from '../Helper/Table';
import { Remove } from '../Helper/Remove';
import { Update } from '../Helper/Update';
import { list } from '../../services/schedule';

export function List() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const columns = [
    {
      label: 'name',
      field: 'name'
    },
    {
      label: 'type',
      field: 'type'
    },
    {
      label: 'startHour',
      field: 'startHour'
    },
    {
      label: 'startMinute',
      field: 'startMinute'
    },
    {
      label: 'endHour',
      field: 'endHour'
    },
    {
      label: 'endMinute',
      field: 'endMinute'
    },
    {
      label: 'Actions',
      field: '_id',
      cell: (value: any) => (
        <React.Fragment>
          <Update view="/schedule/{{ _id }}" data={{ _id: value }} />
          <Remove view="/api/schedule/{{ _id }}/remove" data={{ _id: value }} />
        </React.Fragment>
      )
    }
  ];

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
      <ButtonLink to="/schedule/create" color="primary">
        Create New Schedule
      </ButtonLink>
      {data != null ? (
        <Table data={data} columns={columns} loading={loading} />
      ) : (
        'Loading...'
      )}
    </React.Fragment>
  );
}
