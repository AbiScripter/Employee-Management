const tbody = document.querySelector("tbody");
const form = document.querySelector("form");
const submitButton = document.querySelector("#submit");
const cancelButton = document.querySelector("#cancel");

//to use in adding employess
let currEmployeeId = 1000;
// to edit and updtae records of the employees
let editEmployeeId;

let employeeMap = new Map();

//used to differentiate between we updating or adding employee
let isEdit = false;

//to get the current employee table cells  [to update after editing]
let currentRecord;

function addEmployee(employee) {
  //takes an employee object as input
  //adds it to the table
  const record = document.createElement("tr");
  for (let key in employee) {
    const cell = document.createElement("td");
    cell.innerText = employee[key];
    record.appendChild(cell);
  }

  record.children[0].classList.add("id-cell");
  const options = document.createElement("td");
  let delBtn = document.createElement("button");
  let editBtn = document.createElement("button");

  //setting custom attribute
  editBtn.setAttribute("data-id", employee.employeeId);
  delBtn.setAttribute("data-id", employee.employeeId);

  delBtn.innerText = "Delete";
  editBtn.innerText = "Edit";

  //just for styling purpose
  delBtn.classList.add("delbtn");
  editBtn.classList.add("editBtn");

  options.appendChild(delBtn);
  options.appendChild(editBtn);

  record.appendChild(options);
  tbody.appendChild(record);

  delBtn.addEventListener("click", (event) => deleteRecord(event));
  editBtn.addEventListener("click", (event) => editRecord(event));
}

function deleteRecord(event) {
  //removing the selected row from the table
  event.target.parentNode.parentNode.remove();

  let deleteEmployeeId = Number(event.target.getAttribute("data-id"));
  //deleting from employeeMap
  employeeMap.delete(deleteEmployeeId);

  console.log(employeeMap);
}

function editRecord(event) {
  isEdit = true;
  //get the id of the employee row in which edit button clicked
  //and set that id to editId so that we can use in updateRecord()
  editEmployeeId = Number(event.target.getAttribute("data-id"));
  let editEmployeeData = employeeMap.get(editEmployeeId);

  //prefilling the form
  for (let [key, value] of Object.entries(editEmployeeData)) {
    //skipping the employeeId because its not in html form
    //form[employeeId]=>throws an error , so skipped

    if (key !== "employeeId") {
      form[key].value = value;
    }
  }

  submitButton.innerText = "Update Record";
  currentRecord = event.target.parentNode.parentNode;
}

function updateRecord(data) {
  employeeMap.set(editEmployeeId, data);
  let updatedData = employeeMap.get(editEmployeeId);

  currentRecord.children[1].textContent = updatedData.name;
  currentRecord.children[2].textContent = updatedData.salary;
  currentRecord.children[3].textContent = updatedData.role;
  currentRecord.children[4].textContent = updatedData.team;
  currentRecord.children[5].textContent = updatedData.company;

  console.log(employeeMap);
  //update is done so set isEdit to false so we can add employee
  isEdit = false;
  submitButton.innerText = "Add Employee";
}

function onSubmitForm(event) {
  //to prevent refresh of the page
  event.preventDefault();

  //creating employeeData object from the values provided by the user
  let employeeData = {
    //if editing is true update the same employee
    employeeId: isEdit ? currEmployeeId : ++currEmployeeId,
    name: event.target.name.value,
    salary: event.target.salary.value,
    role: event.target.role.value,
    team: event.target.team.value,
    company: event.target.company.value,
  };

  if (isEdit == true) {
    updateRecord(employeeData);
  } else {
    addEmployee(employeeData);
    //adding employeeData to the map , with key as employeeId and value as employeeData
    employeeMap.set(employeeData.employeeId, employeeData);
  }

  //resetting the form
  form.reset();
}

form.addEventListener("submit", onSubmitForm);
