import * as React from 'react';
import { useState } from 'react';
import { Redirect } from 'react-router-dom';

import { update, list } from '../../services/schedule';

export function Edit(props: any) {
  const [data, setData] = useState(null);
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

    function handleChange(e: any) {
      setValue(e.target.value);
    }

    return {
      value: value,
      onChange: handleChange
    };
  }

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

  async function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const tmp = {
      name: name.value,
      startHour: startHour.value,
      startMinute: startMinute.value,
      endHour: endHour.value,
      endMinute: endMinute.value,
      type: type.value
    };

    const result = await update(props.match.params.id, tmp);
    if (result.errmsg) {
      setError(true);
    } else {
      setDone(true);
    }
  }

  if (done) {
    return <Redirect to="/schedule" />;
  }

  if (data == null) {
    (async () => {
      const tmp = await list({ _id: props.match.params.id });
      setData(tmp[0]);
      name.onChange({ target: { value: tmp[0].name } });
      startHour.onChange({ target: { value: tmp[0].startHour } });
      startMinute.onChange({ target: { value: tmp[0].startMinute } });
      endHour.onChange({ target: { value: tmp[0].endHour } });
      endMinute.onChange({ target: { value: tmp[0].endMinute } });
      type.onChange({ target: { value: tmp[0].type } });
    })();
  }

  return (
    <React.Fragment>
      {data != null ? (
        <form onSubmit={handleFormSubmit} method="POST">
          <p>
            Name
            <input type="text" {...name} />
          </p>
          <p>
            Start Hour
            <select {...startHour}>
              {Array.apply(0, Array(24)).map((x: any, i: number) => (
                <option key={i.toString().concat('startHour')}>{i}</option>
              ))}
            </select>
          </p>
          <p>
            Start Minute
            <select {...startMinute}>
              {Array.apply(0, Array(60)).map((x: any, i: number) => (
                <option key={i.toString().concat('startMinute')}>{i}</option>
              ))}
            </select>
          </p>
          <p>
            End Hour
            <select {...endHour}>
              {Array.apply(0, Array(24)).map((x: any, i: number) => (
                <option key={i.toString().concat('endHour')}>{i}</option>
              ))}
            </select>
          </p>
          <p>
            End Minute
            <select {...endMinute}>
              {Array.apply(0, Array(60)).map((x: any, i: number) => (
                <option key={i.toString().concat('endMinute')}>{i}</option>
              ))}
            </select>
          </p>
          <p>
            Type
            <select {...type}>
              <option>regular</option>
              <option>overtime</option>
            </select>
          </p>
          <input type="submit" />
          {error && <p>Create error</p>}
        </form>
      ) : (
        'Loading...'
      )}
    </React.Fragment>
  );
}
