import * as React from 'react';
import { render } from 'mustache';
import { Link } from 'react-router-dom';

export function Update(props: any) {
  const uri = render(props.view, props.data);

  return <Link to={uri}>{props.children || 'update'}</Link>;
}
