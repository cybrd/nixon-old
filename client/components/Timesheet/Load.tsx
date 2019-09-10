import * as React from 'react';
import { useState } from 'react';

import { upload, uploadCSV } from '../../services/timesheet';

export function Load() {
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState(0);
  const [inserted, setInserted] = useState(0);
  const [uploading, setUploading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFile(e.target.files[0]);
  }

  async function handleFormSubmit(
    e: React.MouseEvent<HTMLInputElement, MouseEvent>
  ) {
    e.preventDefault();
    setUploading(true);
    const result = JSON.parse(await upload(file));

    setErrors(result.errors);
    setInserted(result.inserted);
    setUploading(false);
  }

  async function handleFormSubmitCSV(
    e: React.MouseEvent<HTMLInputElement, MouseEvent>
  ) {
    e.preventDefault();
    setUploading(true);
    const result = JSON.parse(await uploadCSV(file));

    setErrors(result.errors);
    setInserted(result.inserted);
    setUploading(false);
  }

  return (
    <React.Fragment>
      <form>
        <input type="file" onChange={handleChange} />
        <input
          type="button"
          value="Submit KQ file"
          onClick={handleFormSubmit}
        />
        <input
          type="button"
          value="Submit CSV file"
          onClick={handleFormSubmitCSV}
        />

        {uploading && <p>Uploading...</p>}
        {errors > 0 && <p># errors/duplicates: {errors}</p>}
        {inserted > 0 && <p># inserted: {inserted}</p>}
      </form>
      <div>
        <p>Note: backup KQ file / CSV file</p>
      </div>
    </React.Fragment>
  );
}
