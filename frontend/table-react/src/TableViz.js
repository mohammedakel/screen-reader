import React from 'react';

function TableViz(props) {
  if (props.currentTable === null) {
    return(
      <div></div>
    );
  } else {
    //table headers
    const colNames = [];
    //empty row header
    colNames.push(<th key="row-id"></th>)
    colNames.push(props.data[props.currentTable].columns.map((column) =>
      <th key={column.name}>{column.name}</th>
    ));

    //this perhaps could have been done with .map() but I felt more comfortable this way
    const rows = [];
    if (props.data[props.currentTable].columns.length > 0) {
      for (let i = 0; i < props.data[props.currentTable].columns[0].rows.length; i++) {
        let row = [];
        row.push(<td key={i}>{i+1}</td>);
        for (let j = 0; j < props.data[props.currentTable].columns.length; j++) {
          row.push(
            <td key={props.data[props.currentTable].columns[j].rows[i]}>
            {props.data[props.currentTable].columns[j].rows[i]}
            </td>);
        }
        rows.push(row);
      }
    }


    return(
      <table>
        <thead>
          <tr>{colNames}</tr>
        </thead>
        <tbody>
          {rows.map((row, index) => <tr key={index}>{row}</tr>)}
        </tbody>
      </table>
    );
  }

}

export default TableViz;
