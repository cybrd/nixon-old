import * as React from 'react';
import { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';

import { FormControl, Button, Input, InputLabel } from '@material-ui/core';

import { update, list } from '../../services/employee';

export function Edit(props: any) {
  const [done, setDone] = useState(false);
  const [error, setError] = useState(false);

  const inputKeys: any = {
    fingerPrintId: {
      label: 'Finger Print Id',
      field: useFormInput('')
    },
    name: {
      label: 'Name',
      field: useFormInput('')
    },
    department: {
      label: 'Department',
      field: useFormInput('')
    },
    employeeNumber: {
      label: 'Employee Number',
      field: useFormInput('')
    },
    hireDate: {
      label: 'Hire Date',
      field: useFormInput('')
    },
    position: {
      label: 'Position',
      field: useFormInput('')
    },
    startingSalary: {
      label: 'Starting Salary',
      field: useFormInput('')
    },
    latestSalary: {
      label: 'Latest Salary',
      field: useFormInput('')
    },
    dateResigned: {
      label: 'Date Resigned',
      field: useFormInput('')
    },
    totalBalance: {
      label: 'Total Balance',
      field: useFormInput('')
    },
    gender: {
      label: 'Gender',
      field: useFormInput('')
    },
    birthDate: {
      label: 'Birth Date',
      field: useFormInput('')
    },
    address: {
      label: 'Address',
      field: useFormInput('')
    },
    contactNumber: {
      label: 'Contact Number',
      field: useFormInput('')
    },
    TIN: {
      label: 'TIN',
      field: useFormInput('')
    },
    SSS: {
      label: 'SSS',
      field: useFormInput('')
    },
    philHealth: {
      label: 'Phil Health',
      field: useFormInput('')
    },
    pagIbig: {
      label: 'Pag-Ibig',
      field: useFormInput('')
    },
    contactName: {
      label: 'Contact Name',
      field: useFormInput('')
    },
    contactRelationship: {
      label: 'Contact Relationship',
      field: useFormInput('')
    },
    contactAddress: {
      label: 'Contact Address',
      field: useFormInput('')
    },
    contactContactNumber: {
      label: 'Contact Contact Number',
      field: useFormInput('')
    }
  };

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

  async function fetchData() {
    const tmp = await list({ _id: props.match.params.id });

    Object.keys(inputKeys).map(key =>
      inputKeys[key].field.onChange({ target: { value: tmp[0][key] } })
    );
  }

  useEffect(() => {
    fetchData();
  }, []);

  async function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const tmp: any = {};
    Object.keys(inputKeys).map(key => (tmp[key] = inputKeys[key].field.value));

    const result = await update(props.match.params.id, tmp);
    if (result.errmsg) {
      setError(result.errmsg);
    } else {
      setDone(true);
    }
  }

  if (done) {
    return <Redirect to="/employee" />;
  }

  return (
    <form onSubmit={handleFormSubmit}>
      {Object.keys(inputKeys).map(key => (
        <FormControl fullWidth>
          <InputLabel>{inputKeys[key].label}</InputLabel>
          <Input {...inputKeys[key].field} />
        </FormControl>
      ))}
      <Button type="submit" variant="contained" color="primary">
        Submit
      </Button>
      {error && <p>Create error: {error}</p>}
    </form>
  );
}
