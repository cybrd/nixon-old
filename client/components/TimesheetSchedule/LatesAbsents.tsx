import * as React from 'react';
import { useState, useEffect } from 'react';
import { FormControl, InputLabel, Select, TextField } from '@material-ui/core';
import styled from 'styled-components';
import { parse } from 'qs';

import { Table, readableTime } from '../Helper/Table';
import { list } from '../../services/timesheetSchedule';
import { list as employeeList } from '../../services/employee';

export function LatesAbsents(props: any) {
  const [totalLates, setTotalLates] = useState(0);
  const [totalLates1, setTotalLates1] = useState(0);
  const [totalLates2, setTotalLates2] = useState(0);
  const [totalLateMins, setTotalLateMins] = useState(0);
  const [totalAbsents, setTotalAbsents] = useState(0);
  const [totalAbsentsWhole, setTotalAbsentsWhole] = useState(0);
  const [totalAbsentsHalf, setTotalAbsentsHalf] = useState(0);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const employeeFilter = useFormSelect('');
  const [employeeOptions, setEmployeeOptions] = useState(null);
  const startDate = useFormInput('');
  const endDate = useFormInput('');
  const columns = [
    {
      label: 'Finger Print Id',
      field: 'fingerPrintId'
    },
    {
      label: 'Employee Name',
      field: 'employeeName'
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
      cell: readableTime
    },
    {
      label: 'WorkDayWorked',
      field: 'workDayWorked',
      cell: readableTime
    },
    {
      label: 'WorkDayMissing',
      field: 'workDayMissing',
      cell: readableTime
    },
    {
      label: 'Is Absent',
      field: 'isAbsent',
      cell: (value: string) => value && value.toString()
    },
    {
      label: 'Late Allowance',
      field: 'lateAllowance',
      cell: (value: string) => value && value.toString()
    }
  ];
  const copycolumns = [
    'fingerPrintId',
    'employeeName',
    'scheduleName',
    'workDay',
    'workDayTotal',
    'workDayWorked',
    'workDayMissing',
    'isAbsent',
    'lateAllowance'
  ];

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
    const tmp = await Promise.all([employeeList()]);

    setEmployeeOptions(tmp[0]);

    const params = parse(props.location.search.substr(1));
    if (params.employeeId) {
      employeeFilter.onChange({ target: { value: params.employeeId } });
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
    args.secondary = {};

    if (employeeFilter.value) {
      args.employeeId = employeeFilter.value;
      locationSearch.employeeId = employeeFilter.value;
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
    let tmp: any[] = await list(args);
    tmp = tmp.filter(x => x.isLate || x.isAbsent);

    const workDayAbsents: any = {};
    let absents = 0;
    let lates = 0;
    let lates1 = 0;
    let lates2 = 0;
    let lateMins = 0;
    tmp.forEach(x => {
      if (x.isLate || x.lateAllowanceMissing) {
        lates++;

        if (x.lateAllowanceMissing) {
          lates1++;
        } else {
          lates2++;
        }
      }

      lateMins += x.workDayMissing + x.lateAllowanceMissing;

      if (x.isAbsent) {
        absents++;

        if (!workDayAbsents[x.workDay]) {
          workDayAbsents[x.workDay] = 0;
        }

        workDayAbsents[x.workDay]++;
      }
    });

    let absentsWhole = 0;
    let absentsHalf = 0;
    Object.keys(workDayAbsents).forEach(key => {
      if (workDayAbsents[key] > 1) {
        absentsWhole++;
      } else {
        absentsHalf++;
      }
    });

    setTotalAbsents(absents / 2);
    setTotalAbsentsWhole(absentsWhole);
    setTotalAbsentsHalf(absentsHalf);
    setTotalLates(lates);
    setTotalLates1(lates1);
    setTotalLates2(lates2);
    setTotalLateMins(lateMins);
    setData(tmp);
    setLoading(false);

    const location = {
      pathname: '/latesAbsents',
      search: Object.keys(locationSearch)
        .map(key => {
          return key + '=' + encodeURIComponent(locationSearch[key]);
        })
        .join('&')
    };

    props.history.push(location);
  }

  function msToTime(s: number) {
    // Pad to 2 or 3 digits, default is 2
    function pad(n: number, z: any = null) {
      z = z || 2;
      return ('00' + n).slice(-z);
    }

    const ms = s % 1000;
    s = (s - ms) / 1000;
    const secs = s % 60;
    s = (s - secs) / 60;
    const mins = s % 60;
    const hrs = (s - mins) / 60;

    return pad(hrs) + ':' + pad(mins) + ':' + pad(secs) + '.' + pad(ms, 3);
  }

  const query =
    'e' + employeeFilter.value + 's' + startDate.value + 'd' + endDate.value;
  useEffect(() => {
    if (
      employeeOptions &&
      employeeFilter.value &&
      startDate.value &&
      endDate.value
    ) {
      fetchData();
    }
  }, [query]);

  const MyForm3 = styled.form`
    min-width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
  `;

  return (
    <React.Fragment>
      <MyForm3>
        <FormControl fullWidth>
          <InputLabel>Select Employee</InputLabel>
          {employeeOptions != null ? (
            <Select native {...employeeFilter}>
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
      </MyForm3>
      {data.length ? (
        <div>
          <p>Total Absents: {totalAbsents}</p>
          <p>Total Absents Whole Day: {totalAbsentsWhole}</p>
          <p>Total Absents Half Day: {totalAbsentsHalf}</p>
          <p>Total Lates: {totalLates}</p>
          <p>Total Lates w/ Allowance: {totalLates1}</p>
          <p>Total Lates w/o Allowance: {totalLates2}</p>
          <p>Total Lates Mins: {msToTime(totalLateMins)}</p>
        </div>
      ) : (
        ''
      )}
      {data != null ? (
        <Table
          data={data}
          columns={columns}
          orderBy="workDay"
          order="desc"
          loading={loading}
          copycolumns={copycolumns}
        />
      ) : (
        'Loading...'
      )}
    </React.Fragment>
  );
}
