import * as React from 'react';
import { useState, useEffect } from 'react';
import { FormControl, InputLabel, Select, TextField } from '@material-ui/core';
import styled from 'styled-components';
import { parse } from 'qs';

import { Table } from '../Helper/Table';
import { list } from '../../services/timesheetSchedule';
import { list as employeeList } from '../../services/employee';

export function DailyAbsent(props: any) {
  const [totalAbsents, setTotalAbsents] = useState(0);
  const [totalAbsentsWhole, setTotalAbsentsWhole] = useState(0);
  const [totalAbsentsHalf, setTotalAbsentsHalf] = useState(0);
  const [totalAbsentsNoExcuse, setTotalAbsentsNoExcuse] = useState(0);
  const [totalLatesWithoutAllowance, setTotalLatesWithoutAllowance] =
    useState(0);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const employeeFilter = useFormSelect('');
  const [employeeOptions, setEmployeeOptions] = useState(null);
  const date = useFormInput('');
  const columns = [
    {
      label: 'Finger Print Id',
      field: 'fingerPrintId',
    },
    {
      label: 'Employee Name',
      field: 'employeeName',
    },
    {
      label: 'Schedule Name',
      field: 'scheduleName',
    },
    {
      label: 'Work Day',
      field: 'workDay',
      cell: (value: string) => new Date(value).toLocaleDateString(),
    },
    {
      label: 'Is Late Without Allowance',
      field: 'lateWithoutAllowance',
      cell: (value: string) => value && value.toString(),
    },
    {
      label: 'Is Absent',
      field: 'isAbsent',
      cell: (value: string) => value && value.toString(),
    },
    {
      label: 'Notes',
      field: 'notes',
    },
  ];
  const copycolumns = [
    'fingerPrintId',
    'employeeName',
    'scheduleName',
    'workDay',
    'lateWithoutAllowance',
    'isAbsent',
    'notes',
  ];

  function useFormSelect(initialValue: string) {
    const [value, setValue] = useState(initialValue);

    function handleChange(e: any) {
      setValue(e.target.value);
    }

    return {
      value: value,
      onChange: handleChange,
    };
  }

  function useFormInput(initialValue: string) {
    const [value, setValue] = useState(initialValue);

    function handleChange(e: any) {
      setValue(e.target.value);
    }

    return {
      value: value,
      onChange: handleChange,
    };
  }

  async function fetchOptions() {
    const tmp = await Promise.all([employeeList()]);

    setEmployeeOptions(tmp[0]);

    const params = parse(props.location.search.substr(1));
    if (params.employeeId) {
      employeeFilter.onChange({ target: { value: params.employeeId } });
    }

    if (params.date) {
      date.onChange({ target: { value: params.date } });
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

    if (date.value) {
      if (!args.date) {
        args.date = {};
      }

      args.date.$gte = `${date.value} 00:00:00`;
      locationSearch.startDate = date.value;

      args.date.$lte = `${date.value} 23:59:59`;
      locationSearch.endDate = date.value;
    }

    setLoading(true);
    let tmp: any[] = await list(args);
    tmp = tmp.filter((x) => x.isAbsent || x.lateWithoutAllowance);

    const workDayAbsents: any = {};
    let absents = 0;
    let absentsNoExcuse = 0;
    let lates = 0;
    let lates1 = 0;
    let lates2 = 0;
    let lateMins = 0;
    let lateWithoutAllowanceCount = 0;
    tmp.forEach((x) => {
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

        if (!x.notes || !x.notes.trim()) {
          absentsNoExcuse++;
        }

        if (!workDayAbsents[x.workDay]) {
          workDayAbsents[x.workDay] = 0;
        }

        workDayAbsents[x.workDay]++;
      }

      if (x.lateWithoutAllowance) {
        lateWithoutAllowanceCount++;
      }
    });

    let absentsWhole = 0;
    let absentsHalf = 0;
    Object.keys(workDayAbsents).forEach((key) => {
      if (workDayAbsents[key] > 1) {
        absentsWhole++;
      } else {
        absentsHalf++;
      }
    });

    setTotalAbsents(absents / 2);
    setTotalAbsentsNoExcuse(absentsNoExcuse / 2);
    setTotalAbsentsWhole(absentsWhole);
    setTotalAbsentsHalf(absentsHalf);
    setTotalLatesWithoutAllowance(lateWithoutAllowanceCount);
    setData(tmp);
    setLoading(false);

    const location = {
      pathname: '/dailyAbsent',
      search: Object.keys(locationSearch)
        .map((key) => {
          return key + '=' + encodeURIComponent(locationSearch[key]);
        })
        .join('&'),
    };

    props.history.push(location);
  }

  const query = 'e' + employeeFilter.value + 's' + date.value;
  useEffect(() => {
    if (date.value) {
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
            label="Date"
            type="date"
            InputLabelProps={{
              shrink: true,
            }}
            {...date}
          />
        </FormControl>
      </MyForm3>
      {data.length ? (
        <div>
          <p>Total Absents: {totalAbsents}</p>
          <p>Total Absents Whole Day: {totalAbsentsWhole}</p>
          <p>Total Absents Half Day: {totalAbsentsHalf}</p>
          <p>Total Absents No Excuse: {totalAbsentsNoExcuse}</p>
          <p>Total Lates Without Allowance: {totalLatesWithoutAllowance}</p>
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
