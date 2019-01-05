import * as React from 'react';
import { render } from 'mustache';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

export function Update(props: any) {
  const uri = render(props.view, props.data);

  const LinkStyled = styled(Link)`
    color: rgb(63, 81, 181);

    text-decoration: none;
    :hover {
      text-decoration: underline;
    }
  `;
  return <LinkStyled to={uri}>{props.children || 'update'}</LinkStyled>;
}
