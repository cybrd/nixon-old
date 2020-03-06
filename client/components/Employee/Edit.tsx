import * as React from 'react';
import { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';

import {
  FormControl,
  Button,
  Input,
  InputLabel,
  withStyles
} from '@material-ui/core';

import { update, list } from '../../services/employee';

const MyFormControl = withStyles({
  root: {
    height: '40px',
    margin: '3px 0'
  }
})(FormControl);

const MyInput = withStyles({
  root: {
    'margin-top': '10px !important',
    'font-size': '.9em'
  },
  input: {
    'padding-bottom': 0
  }
})(Input);

const MyInputLabel = withStyles({
  root: {
    transform: 'translate(0, 10px)'
  },
  shrink: {
    transform: 'translate(0, 1.5px) scale(0.75)'
  }
})(InputLabel);

export function Edit(props: any) {
  const [done, setDone] = useState(false);
  const [error, setError] = useState(false);
  const [file, setFile] = useState(null);
  const [photo, setPhoto] = useState('');
  const [photoType, setPhotoType] = useState('');

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
    handler: {
      label: 'Handler',
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

  function handleUploadFile(e: React.ChangeEvent<HTMLInputElement>) {
    setFile(e.target.files[0]);
  }

  async function fetchData() {
    const tmp = await list({ _id: props.match.params.id });

    Object.keys(inputKeys).map(key =>
      inputKeys[key].field.onChange({ target: { value: tmp[0][key] } })
    );

    if (tmp[0].photo) {
      setPhoto('/photo/' + tmp[0].photo);
      setPhotoType(tmp[0].photoType);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  async function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const data = new FormData();
    data.append('file', file);

    Object.keys(inputKeys).map(key => {
      data.append(key, inputKeys[key].field.value);
    });

    const result = await update(props.match.params.id, data);
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
      <div>
        {photo && (
          <p style={{ textAlign: 'center' }}>
            <img src={photo} style={{ maxWidth: 200, maxHeight: 200 }} />
          </p>
        )}
        <p style={{ textAlign: 'center' }}>
          Change photo:
          <input type="file" onChange={handleUploadFile} />
        </p>
      </div>

      {Object.keys(inputKeys).map(key => (
        <MyFormControl fullWidth key={key}>
          <MyInputLabel>{inputKeys[key].label}</MyInputLabel>
          <MyInput {...inputKeys[key].field} />
        </MyFormControl>
      ))}

      <Button type="submit" variant="contained" color="primary">
        Submit
      </Button>
      {error && <p>Create error: {error}</p>}
    </form>
  );
}
