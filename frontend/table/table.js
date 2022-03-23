"use strict";
const loadButton = document.getElementById("loader");
const dropdownDiv = document.getElementById("dropdown");
const dropdown = document.createElement("select");
const content = document.getElementById("content");
const htmlTable = document.createElement("table");
//where the data is ultimately stored
let tableStorage = new Array();
/*
  Fetch the loaded data from the backend when the load button is pressed
*/
loadButton.addEventListener("click", (event) => {
    fetchTableData();
});
/*
  The actual function to get the backend data. Doesn't use query parameters,
  so it loads the entire database at once (for only one GET call).
*/
function fetchTableData() {
    fetch('http://localhost:4567/table')
        .then((result) => {
        result.json().then((data) => {
            //refresh the tables
            tableStorage = new Array();
            //add each table name to the dropdown
            const names = new Array();
            for (let i = 0; i < data.length; i++) {
                names.push(data[i].name);
                tableStorage.push(data[i]);
            }
            setUpDrowndown(names);
            //make first <table> so that something appears when load is pressed
            makeTable(tableStorage[0]);
        });
    })
        .catch((error) => console.error("Error:", error));
}
/*
  Set up the dropdown menu once the data is loaded in, to give access to all
  the table names
*/
function setUpDrowndown(names) {
    //reset everything first
    dropdownDiv.innerHTML = "";
    while (dropdown.firstChild) {
        dropdown.removeChild(dropdown.firstChild);
    }
    //start adding things back
    dropdownDiv.append(dropdown);
    for (let i = 0; i < names.length; i++) {
        const el = document.createElement("option");
        el.text = names[i];
        el.value = names[i];
        dropdown.append(el);
    }
    dropdown.addEventListener("change", (event) => {
        for (let i = 0; i < tableStorage.length; i++) {
            if (tableStorage[i].name === dropdown.value) {
                makeTable(tableStorage[i]);
            }
        }
    });
}
function makeTable(table) {
    //reset old table
    content.innerHTML = "";
    htmlTable.innerHTML = "";
    //make table
    content.append(htmlTable);
    //set up columns
    const columnHeaders = document.createElement("tr");
    for (let i = 0; i < table.columns.length; i++) {
        const col = document.createElement("th");
        col.innerHTML = table.columns[i].name;
        columnHeaders.append(col);
    }
    htmlTable.append(columnHeaders);
    //fill columns: this assumes all the columns have the same number of rows (!)
    for (let i = 0; i < table.columns[0].rows.length; i++) {
        const newRow = document.createElement("tr");
        for (let k = 0; k < table.columns.length; k++) {
            const cell = document.createElement("td");
            cell.innerHTML = table.columns[k].rows[i].valueOf();
            newRow.append(cell);
        }
        htmlTable.append(newRow);
    }
}
