"use strict";
const loadButton = document.getElementById("loader");
loadButton.addEventListener("click", (event) => {
    fetchTableData();
});
function fetchTableData() {
    console.log('start');
    fetch('http://localhost:4567/table')
        .then((result) => {
        console.log(result.json());
    })
        .catch((error) => console.error("Error:", error));
}
