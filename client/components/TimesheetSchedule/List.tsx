import * as React from 'react';
import { useState } from 'react';

import { Table } from '../Helper/Table';
import { list } from '../../services/timesheetSchedule';

export function List() {
  const [data, setData] = useState(null);
  const columns = [
    {
      label: 'Finger Print Id',
      field: 'fingerPrintId'
    },
    {
      label: 'Schedule Name',
      field: 'scheduleName'
    },
    {
      label: 'Work Day',
      field: 'workDay',
      cell: (value: string) => new Date(value).toLocaleDateString()
    },
    {
      label: 'WorkDayTotal',
      field: 'workDayTotal',
      cell: (value: number) => {
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
    },
    {
      label: 'WorkDayWorked',
      field: 'workDayWorked',
      cell: (value: number) => {
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
    },
    {
      label: 'WorkDayMissing',
      field: 'workDayTotal',
      cell: (value: number, rowData: any) => {
        value -= rowData.workDayWorked;
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
    }
  ];

  if (data == null) {
    (async () => {
      const tmp = await list();
      setData(tmp);
    })();
  }

  return (
    <React.Fragment>
      {data != null && data.length ? (
        <Table data={data} columns={columns} orderBy="workDay" />
      ) : (
        'Loading...'
      )}
    </React.Fragment>
  );
}
