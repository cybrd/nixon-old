import * as React from 'react';
import { FormControl } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import styled from 'styled-components';

export function FormControlWithRemove(props: any) {
  const { remove, ...myprops } = props;

  const FormControlStyled = styled(FormControl)`
    display: grid !important;
    grid-template-columns: 1fr auto;
  `;
  const DeleteIconWrapper = styled.div`
    align-self: center;
  `;

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();

    if (confirm('Are you sure?')) {
      remove();
    }
  }

  return (
    <FormControlStyled {...myprops}>
      {myprops.children}
      <DeleteIconWrapper>
        <DeleteIcon onClick={handleClick} />
      </DeleteIconWrapper>
    </FormControlStyled>
  );
}
