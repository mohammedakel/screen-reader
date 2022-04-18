//I'm not using TypeScript——sorry
import React, {useState} from 'react';
import './App.css';
import TableViz from './TableViz';
import axios from 'axios';

function App() {
  const [tableStorage, updateTables] = useState([]);
  const [tableNames, updateNames] = useState([]);
  const [currentTableIndex, updateCurrentTable] = useState(null);

  /*
    GET the table data from the backend and update states accordingly
  */
  function fetchTableData() {
    axios.get('http://localhost:4567/table')
      .then(response => {
        //refresh the tables
        const tables = [];
        //add each table name to the dropdown
        const names = [];
        for (let i = 0; i < response.data.length; i++) {
          names.push(response.data[i].name);
          tables.push(response.data[i]);
        }
        updateNames(names);
        if (currentTableIndex === null) {
          updateCurrentTable(0);
        }
        updateTables(tables);
      })
    .catch((error) => console.error("Error:", error));
  }

  /*
    Dropdown functional component displays the dynamic dropdown menu whose options
    are updated whenever fetchTableData is called. Choosing an option will
    display a different table (see getOptionIndex)
  */
  function Dropdown() {
    //conditional rendering
    if (tableNames.length < 1) {
      return(
        <p>No tables 😞</p>
      );
    } else {
      const options = tableNames.map((name, index) =>
        <option key={index} value={name}>{name}</option>
      );

      /*
        Since the TableViz component takes in an index, we need to convert the
        option's value (name) to its respective index
        (because I couldn't use something like event.target.key for some reason)
      */
      function getOptionIndex(name) {
        let match = null;
        for (let i = 0; i < options.length; i++) {
          if (options[i].props.value === name) {
            match = i;
          }
        }
        updateCurrentTable(match);
      }

      return(
        //value attribute to keep the current option name visible on rerender
        <select value={tableNames[currentTableIndex]} onChange={(event) => {
          getOptionIndex(event.target.value)}}
        >
          {options}
        </select>
      );
    }
  }

  async function deleteRow() {
    let rowNumber = parseInt(document.getElementById("drow").value);
    if (!isNaN(rowNumber)) {
      //account for the 1 index
      rowNumber = rowNumber - 1;
      if (rowNumber >= 0 && rowNumber < tableStorage[currentTableIndex].columns[0].rows.length) {
        const request = {"table": tableNames[currentTableIndex], "row": rowNumber};
        await axios.post('http://localhost:4567/delete-row', request);
        fetchTableData();
      }
    }
  }

  async function deleteColumn() {
    //test if column name is actually one of the columns
    const columnName = document.getElementById("dcol").value;
    let match = false;
    for (let i = 0; i < tableStorage[currentTableIndex].columns.length; i++) {
      if (columnName === tableStorage[currentTableIndex].columns[i].name) {
        match = true;
        break;
      }
    }
    if (match) {
      const request = {"table": tableNames[currentTableIndex], "column": columnName};
      await axios.post('http://localhost:4567/delete-column', request);
      fetchTableData();
    }
  }

  async function insertRow() {
    const inputs = document.getElementsByClassName("form-input");
    const actualInputs = [];
    for (let i = 0; i < inputs.length; i++) {
      actualInputs.push(inputs[i].value);
    }
    if (actualInputs.length === tableStorage[currentTableIndex].columns.length) {
      const request = {"table": tableNames[currentTableIndex], "content": actualInputs};
      await axios.post('http://localhost:4567/add-row', request);
      fetchTableData();
    }

  }

  return (
    <div className="App">
      <h1>Sprint 4 Table Visualization</h1>
      <div className="button-container">
		    <button onClick={fetchTableData}>Load data</button>
		    <Dropdown />
      </div>
      <div id="table-container">
		    <TableViz currentTable={currentTableIndex} data={tableStorage}/>
        {tableStorage.length > 0 &&
        <div id="edit-container">
          <label htmlFor="drow">delete row:</label>
          <div className="button-container">
            <input type="text" name="drow" id="drow" placeholder="row number"/>
            <button onClick={deleteRow}>Submit</button>
          </div>
          <label htmlFor="dcol">delete column:</label>
          <div className="button-container">
            <input type="text" name="dcol" id="dcol" placeholder="column name"/>
            <button onClick={deleteColumn}>Submit</button>
          </div>
          <h3>insert a row</h3>
          <form>
            {tableStorage[currentTableIndex].columns.map((col) =>
              <div key={col.name} className="form-section">
              <label htmlFor={col.name}>{col.name}</label>
              <input className="form-input" type="text" name={col.name} id={col.name}/>
              </div>
            )}
            <button id="form-submit" onClick={(event) => {
              event.preventDefault();
              insertRow();
            }}>Submit</button>
          </form>
        </div>
        }
      </div>
    </div>
  );
}

export default App;
