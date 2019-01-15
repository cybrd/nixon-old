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

    let errorCount = 0;
    let insertCount = 0;
    result.forEach((x: any) => {
      if (x.errmsg) {
        errorCount++;
      } else {
        insertCount++;
      }
    });
    setErrors(errorCount);
    setInserted(insertCount);
    setUploading(false);
  }

  return (
    <form onSubmit={handleFormSubmit}>
      <input type="file" onChange={handleChange} />
      <input type="submit" />
      {uploading && <p>Uploading...</p>}
      {errors > 0 && <p># errors/duplicates: {errors}</p>}
      {inserted > 0 && <p># inserted: {inserted}</p>}
    </form>
  );
}
