import * as React from 'react';
import { useState } from 'react';

import { upload } from '../../services/employeeSchedule';

export function Load() {
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState(0);
  const [inserted, setInserted] = useState(0);
  const [uploading, setUploading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFile(e.target.files[0]);
  }

  async function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setUploading(true);
    const result = JSON.parse(await upload(file));

    setErrors(result.errors);
    setInserted(result.inserted);
    setUploading(false);
  }

  return (
    <React.Fragment>
      <form onSubmit={handleFormSubmit}>
        <input type="file" onChange={handleChange} />
        <input type="submit" />
        {uploading && <p>Uploading...</p>}
        {errors > 0 && <p># errors/duplicates: {errors}</p>}
        {inserted > 0 && <p># inserted: {inserted}</p>}
      </form>

      <div>
        <p>CSV Format:</p>
        <p>Finger Print, Schedule Name, Payroll Name,Date1,Date2,Date3...</p>
        <p>Example:</p>
        <p>
          2,OfficeMorning,janA,1/1/2019,1/2/2019,1/3/2019,1/4/2019
          <br />
          3,OfficeMorning,janA,1/1/2019,1/2/2019,1/3/2019,1/4/2019
          <br />
          4,OfficeMorning,janA,1/1/2019,1/2/2019,1/3/2019,1/4/2019
          <br />
          5,OfficeMorning,janA,1/1/2019,1/2/2019,1/3/2019,1/4/2019
          <br />
          6,OfficeMorning,janA,1/1/2019,1/2/2019,1/3/2019,1/4/2019
          <br />
          7,OfficeMorning,janA,1/1/2019,1/2/2019,1/3/2019,1/4/2019
          <br />
          8,OfficeMorning,janA,1/1/2019,1/2/2019,1/3/2019,1/4/2019
          <br />
          9,OfficeMorning,janA,1/1/2019,1/2/2019,1/3/2019,1/4/2019
        </p>
      </div>
    </React.Fragment>
  );
}
