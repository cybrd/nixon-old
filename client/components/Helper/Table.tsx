import * as React from 'react';

export function Table(props: any) {
  return (
    <table>
      <thead>
        <tr>
          {props.headers.map((row: any) => {
            return <th key={row}>{row}</th>;
          })}
        </tr>
      </thead>
      <tbody>
        {props.children.map((row: any) => {
          return (
            <tr key={row._id}>
              {props.headers.map((k: any) => {
                return <td key={row._id.concat(k)}>{row[k]}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
