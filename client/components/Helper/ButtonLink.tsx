import * as React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@material-ui/core';

export function ButtonLink(props: any) {
  return (
    <Button component={Link} {...props}>
      {props.children}
    </Button>
  );
}
