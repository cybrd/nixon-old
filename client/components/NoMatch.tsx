import * as React from 'react';

export function NoMatch(props: any) {
  return (
    <p>
      No match for <code>{props.location.pathname}</code>
    </p>
  );
}
