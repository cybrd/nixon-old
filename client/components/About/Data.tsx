import * as React from 'react';
import { useState } from 'react';

import { MyFetch } from '../../services/MyFetch';

export function Data() {
  const [data, setData] = useState(null);

  if (data == null) {
    (async () => {
      const tmp = await MyFetch('/api', {}, true);
      setData(tmp);
    })();
  }

  return <div>{data != null ? data : 'Loading...'}</div>;
}
