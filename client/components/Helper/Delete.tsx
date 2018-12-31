import * as React from 'react';
import { render } from 'mustache';
import { myFetch } from '../../services/myFetch';
import { styled } from '../../my.styled';

export function Delete(props: any) {
  async function handleClick(
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) {
    e.preventDefault();

    if (confirm('Are you sure?')) {
      const uri = render(props.view, props.children);
      await myFetch(uri, {
        method: 'POST'
      });
      window.location.reload();
    }
  }

  const A = styled.a`
    color: blue;
    text-decoration: underline;
    cursor: pointer;
  `;
  return <A onClick={handleClick}>delete</A>;
}
