import * as React from 'react';
import { Button } from '@material-ui/core';
import styled from 'styled-components';

export function ButtonCopyClipboard(props: any) {
  async function handleClick() {
    const result: any = [];
    props.data.forEach((x: any) => {
      const line: any = [];
      props.columns.forEach((y: any) => {
        line.push(x[y.field]);
      });
      result.push(line.join('\t'));
    });
    copyToClipboard(result.join('\n'));
  }

  const ButtonStyled = styled(Button)`
    text-transform: none !important;
  `;

  return (
    <ButtonStyled {...props} onClick={handleClick}>
      {props.children}
    </ButtonStyled>
  );
}

const copyToClipboard = (txt: string) => {
  const el = document.createElement('textarea');
  el.value = txt;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
};
