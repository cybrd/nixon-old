import * as React from 'react';
import { useState } from 'react';

import { upload } from '../../services/employee';

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
        <p>Notes:</p>
        <p>Encoding UTF8</p>
        <p>Header:</p>
        <p>
          employeeNumber,fingerPrintId,name,hireDate,department,position,startingSalary,latestSalary,dateResigned,totalBalance,gender,birthDate,address,contactNumber,TIN,SSS,philHealth,pagIbig,contactName,contactRelationship,contactAddress,contactContactNumber,,,,,,,,,,,,,,
        </p>
      </div>
    </React.Fragment>
  );
}
