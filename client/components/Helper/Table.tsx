import * as React from 'react';
import { Edit } from './Edit';
import { Delete } from './Delete';

export function Table(props: any) {
  return (
    <React.Fragment>
      {props.children.length ? (
        <table>
          <thead>
            <tr>
              {props.headers.map((row: any) => {
                switch (row[0]) {
                  case 'edit':
                  case 'remove':
                  case 'date':
                  case 'timestamp':
                    return <th key={row[0]}>{row[0]}</th>;
                  default:
                    return <th key={row}>{row}</th>;
                }
              })}
            </tr>
          </thead>
          <tbody>
            {props.children.map((row: any) => {
              return (
                <tr key={row._id}>
                  {props.headers.map((k: any) => {
                    switch (k[0]) {
                      case 'edit':
                        return (
                          <td key={row._id.concat(k[0])}>
                            <Edit view={k[1]}>{row}</Edit>
                          </td>
                        );
                      case 'remove':
                        return (
                          <td key={row._id.concat(k[0])}>
                            <Delete view={k[1]}>{row}</Delete>
                          </td>
                        );
                      case 'timestamp':
                        return (
                          <td key={row._id.concat(k[1])}>
                            {new Date(row[k[1]]).toLocaleString()}
                          </td>
                        );
                      case 'date':
                        return (
                          <td key={row._id.concat(k[1])}>
                            {new Date(row[k[1]]).toLocaleDateString()}
                          </td>
                        );
                      default:
                        return <td key={row._id.concat(k)}>{row[k]}</td>;
                    }
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <p>No data</p>
      )}
    </React.Fragment>
  );
}
