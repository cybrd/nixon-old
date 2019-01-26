import * as React from 'react';
import { Button } from '@material-ui/core';
import styled from 'styled-components';

export function ButtonCopyClipboard(props: any) {
  function handleClick() {
    const result: any = [];
    props.data.forEach((row: any) => {
      const line: any = [];
      props.columns.forEach((column: any) => {
        if (props.copycolumns.indexOf(column.field) < 0) {
          return;
        }

        if (column.cell) {
          line.push(column.cell(row[column.field], row));
        } else {
          line.push(row[column.field]);
        }
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
