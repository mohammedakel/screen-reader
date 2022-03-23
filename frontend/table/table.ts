const loadButton: HTMLButtonElement = document.getElementById("loader") as HTMLButtonElement;
loadButton.addEventListener("click", (event) => {
  fetchTableData();
});

function fetchTableData() {
    console.log('start');
    fetch('http://localhost:4567/table')
    .then((result) => {
      console.log(result.json());
    })
    .catch((error: any) => console.error("Error:", error))
}
