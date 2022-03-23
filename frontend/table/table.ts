const loadButton: HTMLButtonElement = document.getElementById("loader") as HTMLButtonElement
const dropdownDiv: HTMLDivElement = document.getElementById("dropdown") as HTMLDivElement
const dropdown: HTMLSelectElement = document.createElement("select")

//A Table is mostly just an Array of Column objects (as seen in Java)
type Column = {
  name: string;
  type: string;
  rows: Array<String>;
}
type Table = {
  columns: Array<Column>;
  name: string;
}
type Tables = { 
  tables: Array<Table>;
}

//where the data is ultimately stored
let tableStorage: Array<Table> = new Array()

/*
  Fetch the loaded data from the backend when the load button is pressed
*/
loadButton.addEventListener("click", (event) => {
  fetchTableData()
});

/*
  The actual function to get the backend data. Doesn't use query parameters,
  so it loads the entire database at once (for only one GET call).
*/
function fetchTableData() {
    fetch('http://localhost:4567/table')
    .then((result) => {
      result.json().then((data) => {
        console.log(data)
        //refresh the tables
        tableStorage = new Array()
        //add each table name to the dropdown
        const names = new Array()
        // for (let i = 0; i < data.tables.length; i++) {
        //   names.push(data.tables[i].name)
        //   tables.push(data.tables[i])
        // }
        // setUpDrowndown(names)
        console.log(data.tables)
      })
    })
    .catch((error: any) => console.error("Error:", error))
}

/*
  Set up the dropdown menu once the data is loaded in, to give access to all
  the table names
*/
function setUpDrowndown(names: Array<string>) {
  //reset everything first
  dropdownDiv.innerHTML = ""
  while (dropdown.firstChild) {
    dropdown.removeChild(dropdown.firstChild)
  }
  //start adding things back
  dropdownDiv.append(dropdown)
  for (let i = 0; i < names.length; i++) {
    const el = document.createElement("option");
    el.text = names[i]
    el.value = names[i]
    dropdown.append(el)
  }
  dropdown.addEventListener("change", (event) => {
    for (let i = 0; i < tableStorage.length; i++) {
      if (tableStorage[i].name === dropdown.value) {
        makeTable(tableStorage[i])
      }
    }
  })
}

function makeTable(table: Table) {
  console.log(table.name)
}
