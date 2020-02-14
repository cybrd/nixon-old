import * as React from 'react';
import { useState, useEffect } from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  TextField,
  Button
} from '@material-ui/core';
import styled from 'styled-components';
import { parse } from 'qs';
import Popup from 'reactjs-popup';

import { ButtonLink } from '../Helper/ButtonLink';
import { Table } from '../Helper/Table';
import { Remove } from '../Helper/Remove';
import { Update } from '../Helper/Update';
import {
  listPopulated,
  removeMany,
  update
} from '../../services/employeeSchedule';
import { list as employeeList } from '../../services/employee';
import { list as payrollList } from '../../services/payroll';

export function List(props: any) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const employeeId = useFormSelect('');
  const payrollId = useFormSelect('');
  const startDate = useFormInput('');
  const endDate = useFormInput('');
  const [notes, setNotes] = useState(null);
  const [employeeOptions, setEmployeeOptions] = useState(null);
  const [payrollOptions, setPayrollOptions] = useState(null);
  const columns = [
    {
      label: 'Finger Print Id',
      field: 'fingerPrintId'
    },
    {
      label: 'Employee Name',
      field: 'employeeName',
      cell: (value: string, rowData: any) => (
        <Update
          view="/employee/{{ _id }}"
          data={{ _id: rowData.employeeId._id }}
        >
          {rowData.employeeName}
        </Update>
      )
    },
    {
      label: 'Schedule Name',
      field: 'scheduleName',
      cell: (value: string, rowData: any) => (
        <Update
          view="/schedule/{{ _id }}"
          data={{ _id: rowData.scheduleId._id }}
        >
          {rowData.scheduleName}
        </Update>
      )
    },
    {
      label: 'Payroll Name',
      field: 'payrollName',
      cell: (value: string, rowData: any) => (
        <Update view="/payroll/{{ _id }}" data={{ _id: rowData.payrollId._id }}>
          {rowData.payrollName}
        </Update>
      )
    },
    {
      label: 'Date',
      field: 'date',
      cell: (value: any) => {
        const date = new Date(value);
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        return days[date.getDay()] + ' ' + date.toLocaleDateString();
      }
    },
    {
      label: 'Notes',
      field: 'notes'
    },
    {
      label: 'Actions',
      field: '_id',
      cell: (value: string, rowData: any) => {
        return (
          <React.Fragment>
            <Update view="/employeeSchedule/{{ _id }}" data={{ _id: value }} />
            <Remove
              view="/api/employeeSchedule/{{ _id }}/remove"
              data={{ _id: value }}
            />
            <Popup
              trigger={<button>Edit Notes</button>}
              modal
              onOpen={() => setNotes(rowData.notes)}
            >
              {close => (
                <div>
                  <FormControl fullWidth>
                    <TextField
                      rows="4"
                      multiline
                      value={notes}
                      onChange={e => setNotes(e.target.value)}
                    />
                  </FormControl>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    onClick={handleNotesSubmit(value)}
                  >
                    Submit
                  </Button>
                  <Button type="button" variant="contained" onClick={close}>
                    Cancel
                  </Button>
                </div>
              )}
            </Popup>
          </React.Fragment>
        );
      }
    }
  ];

  function handleNotesSubmit(value: string) {
    return async () => {
      await update(value, { notes });
      window.location.reload();
    };
  }

  function useFormInput(initialValue: string) {
    const [value, setValue] = useState(initialValue);

    function handleChange(e: any) {
      setValue(e.target.value);
    }

    return {
      value: value,
      onChange: handleChange
    };
  }

  async function fetchOptions() {
    const tmp = await Promise.all([employeeList(), payrollList()]);

    setEmployeeOptions(tmp[0]);
    setPayrollOptions(tmp[1]);

    const params = parse(props.location.search.substr(1));
    if (params.employeeId) {
      employeeId.onChange({ target: { value: params.employeeId } });
    }

    if (params.payrollId) {
      payrollId.onChange({ target: { value: params.payrollId } });
    }

    if (params.startDate) {
      startDate.onChange({ target: { value: params.startDate } });
    }

    if (params.endDate) {
      endDate.onChange({ target: { value: params.endDate } });
    }
  }

  useEffect(() => {
    fetchOptions();
  }, []);

  async function fetchData() {
    const args: any = {};
    const locationSearch: any = {};

    if (employeeId.value) {
      args.employeeId = employeeId.value;
      locationSearch.employeeId = employeeId.value;
    }

    if (payrollId.value) {
      args.payrollId = payrollId.value;
      locationSearch.payrollId = payrollId.value;
    }

    if (startDate.value) {
      if (!args.date) {
        args.date = {};
      }

      args.date.$gte = `${startDate.value} 00:00:00`;
      locationSearch.startDate = startDate.value;
    }

    if (endDate.value) {
      if (!args.date) {
        args.date = {};
      }

      args.date.$lte = `${endDate.value} 23:59:59`;
      locationSearch.endDate = endDate.value;
    }

    setLoading(true);
    const tmp = await listPopulated(args);
    tmp.forEach((x: any) => {
      x.fingerPrintId = x.employeeId.fingerPrintId;
      x.employeeName = x.employeeId.name;
      x.scheduleName = x.scheduleId.name;
      x.payrollName = x.payrollId.name;
    });
    setData(tmp);
    setLoading(false);

    const location = {
      pathname: '/employeeSchedule',
      search: Object.keys(locationSearch)
        .map(key => {
          return key + '=' + encodeURIComponent(locationSearch[key]);
        })
        .join('&')
    };

    props.history.push(location);
  }

  const query =
    'e' +
    employeeId.value +
    'p' +
    payrollId.value +
    's' +
    startDate.value +
    'd' +
    endDate.value;
  useEffect(() => {
    if (employeeOptions) {
      fetchData();
    }
  }, [query]);

  function useFormSelect(initialValue: string) {
    const [value, setValue] = useState(initialValue);

    function handleChange(e: any) {
      setValue(e.target.value);
    }

    return {
      value: value,
      onChange: handleChange
    };
  }

  const MyForm = styled.form`
    min-width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
  `;

  return (
    <React.Fragment>
      <ButtonLink to="/employeeSchedule/create" color="primary">
        Create New Employee Schedule
      </ButtonLink>
      <MyForm>
        <FormControl fullWidth>
          <InputLabel>Select Employee</InputLabel>
          {employeeOptions != null ? (
            <Select native {...employeeId}>
              <option value="" />
              {employeeOptions.map((x: any) => (
                <option key={x._id} value={x._id}>
                  {x.fingerPrintId} - {x.name}
                </option>
              ))}
            </Select>
          ) : (
            'Loading...'
          )}
        </FormControl>
        <FormControl fullWidth>
          <InputLabel>Select Payroll</InputLabel>
          {payrollOptions != null ? (
            <Select native {...payrollId}>
              <option value="" />
              {payrollOptions.map((x: any) => (
                <option key={x._id} value={x._id}>
                  {x.name}
                </option>
              ))}
            </Select>
          ) : (
            'Loading...'
          )}
        </FormControl>
        <FormControl fullWidth>
          <TextField
            label="Start Date"
            type="date"
            InputLabelProps={{
              shrink: true
            }}
            {...startDate}
          />
        </FormControl>
        <FormControl fullWidth>
          <TextField
            label="End Date"
            type="date"
            InputLabelProps={{
              shrink: true
            }}
            {...endDate}
          />
        </FormControl>
      </MyForm>
      {data != null ? (
        <Table
          data={data}
          columns={columns}
          orderBy="date"
          order="desc"
          loading={loading}
          removeFn={removeMany}
        />
      ) : (
        'Loading...'
      )}
    </React.Fragment>
  );
}
