import * as React from 'react';
import { useState } from 'react';
import { Redirect } from 'react-router-dom';

import {
  FormControl,
  Button,
  InputLabel,
  Input,
  Select,
  MenuItem
} from '@material-ui/core';

import { create } from '../../services/schedule';

export function Create() {
  const name = useFormInput('');
  const startHour = useFormSelect('0');
  const startMinute = useFormSelect('0');
  const endHour = useFormSelect('0');
  const endMinute = useFormSelect('0');
  const type = useFormSelect('regular');
  const [done, setDone] = useState(false);
  const [error, setError] = useState(false);

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

  function useFormSelect(initialValue: string) {
    const [value, setValue] = useState(initialValue);

    function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
      setValue(e.target.value);
    }

    return {
      value: value,
      onChange: handleChange
    };
  }

  async function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const data = {
      name: name.value,
      startHour: startHour.value,
      startMinute: startMinute.value,
      endHour: endHour.value,
      endMinute: endMinute.value,
      type: type.value
    };

    const result = await create(data);
    if (result.errmsg) {
      setError(result.errmsg);
    } else {
      setDone(true);
    }
  }

  if (done) {
    return <Redirect to="/schedule" />;
  }

  return (
    <form onSubmit={handleFormSubmit}>
      <FormControl fullWidth>
        <InputLabel>Name</InputLabel>
        <Input {...name} />
      </FormControl>
      <FormControl fullWidth>
        <InputLabel>Start Hour</InputLabel>
        <Select {...startHour}>
          {Array.apply(0, Array(24)).map((x: any, i: number) => (
            <MenuItem
              key={i.toString().concat('startHour')}
              value={i.toString()}
            >
              {i.toString()}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth>
        <InputLabel>Start Minute</InputLabel>
        <Select {...startMinute}>
          {Array.apply(0, Array(60)).map((x: any, i: number) => (
            <MenuItem
              key={i.toString().concat('startMinute')}
              value={i.toString()}
            >
              {i.toString()}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth>
        <InputLabel>End Hour</InputLabel>
        <Select {...endHour}>
          {Array.apply(0, Array(24)).map((x: any, i: number) => (
            <MenuItem key={i.toString().concat('endHour')} value={i.toString()}>
              {i.toString()}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth>
        <InputLabel>End Minute</InputLabel>
        <Select {...endMinute}>
          {Array.apply(0, Array(60)).map((x: any, i: number) => (
            <MenuItem
              key={i.toString().concat('endMinute')}
              value={i.toString()}
            >
              {i.toString()}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth>
        <InputLabel>Type</InputLabel>
        <Select {...type}>
          <MenuItem value="regular">regular</MenuItem>
          <MenuItem value="overtime">overtime</MenuItem>
        </Select>
      </FormControl>
      <Button type="submit" variant="contained" color="primary">
        Submit
      </Button>
      {error && <p>Create error: {error}</p>}
    </form>
  );
}
