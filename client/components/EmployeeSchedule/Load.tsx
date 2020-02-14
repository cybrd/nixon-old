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
        <p>Payroll Name,Finger Print, Schedule Name, Date1,Date2,Date3...</p>
        <p>Example:</p>
        <p>
          janA,2,OfficeMorning,1/1/2019,notes
          <br />
          janA,3,OfficeMorning,1/1/2019,notes
          <br />
          janA,4,OfficeMorning,1/1/2019,notes
          <br />
          janA,5,OfficeMorning,1/1/2019,notes
          <br />
          janA,6,OfficeMorning,1/1/2019,notes
          <br />
          janA,7,OfficeMorning,1/1/2019,notes
          <br />
          janA,8,OfficeMorning,1/1/2019,notes
          <br />
          janA,9,OfficeMorning,1/1/2019,notes
        </p>
      </div>
    </React.Fragment>
  );
}
