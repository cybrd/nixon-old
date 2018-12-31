import * as React from 'react';
import { render } from 'mustache';
import { Link } from 'react-router-dom';

export function Edit(props: any) {
  const uri = render(props.view, props.children);

  async function handleClick(
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) {
    e.preventDefault();
  }

  return <Link to={uri}>edit</Link>;
}
