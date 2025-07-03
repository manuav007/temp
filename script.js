// script.js
const criteriaData = [
  {
    name: "Leadership",
    sub: []
  },
  {
    name: "Planning & Strategy",
    sub: []
  },
  {
    name: "People Management",
    sub: ["Human Resource", "Safety Management", "Medical Care"]
  },
  {
    name: "Community and Environment Management",
    sub: ["CSR-CD", "Environment"]
  },
  {
    name: "Business Function Management",
    sub: ["Stores", "Chemistry", "Operation and EEMG", "Maintenance and MTP"]
  },
  {
    name: "People Results",
    sub: ["People Perception", "HR Result", "Safety Result", "Medical Result"]
  },
  {
    name: "Community and Environment Results",
    sub: ["Community Perception", "CSR-CD", "Environment Result"]
  },
  {
    name: "Beneficiary and Operational Results",
    sub: ["Beneficiary Perception", "Stores", "Chemistry", "Operation and EEMG", "Maintenance and MTP"]
  },
  {
    name: "Business Results",
    sub: ["Business Performance Outcomes", "Business Performance Indicators"]
  }
];

let tableCount = 0;

criteriaData.forEach((crit, i) => {
  const root = document.getElementById('criteria-root');

  // Create main criteria container
  const container = document.createElement('div');
  container.className = 'criteria-container';

  // Create criteria header with dropdown button
  const header = document.createElement('div');
  header.className = 'criteria-header';

  const dropdownBtn = document.createElement('button');
  dropdownBtn.className = 'dropdown-btn';
  dropdownBtn.textContent = `Criteria ${i + 1}: ${crit.name}`;
  dropdownBtn.onclick = function() {
    this.classList.toggle('active');
    const content = this.parentElement.nextElementSibling;
    content.classList.toggle('active');
  };

  header.appendChild(dropdownBtn);
  container.appendChild(header);

  // Create criteria content (initially hidden)
  const content = document.createElement('div');
  content.className = 'criteria-content';

  // Add textarea for criteria
  const paragraphField = document.createElement('textarea');
  paragraphField.placeholder = `Write paragraph for Criteria ${i + 1}...`;
  content.appendChild(paragraphField);

  // Add "Add Resources" button
  const addResourcesBtn = document.createElement('button');
  addResourcesBtn.className = 'add-resources-btn';
  addResourcesBtn.textContent = 'Add Resources';
  addResourcesBtn.onclick = function() {
    const options = this.nextElementSibling;
    options.classList.toggle('active');
  };
  content.appendChild(addResourcesBtn);

  // Add resources options (initially hidden)
  const resourcesOptions = document.createElement('div');
  resourcesOptions.className = 'resources-options';

  // Add "Create Table" button
  const tableBtn = document.createElement('button');
  tableBtn.textContent = 'Create Table';
  tableBtn.onclick = () => createTable(content);
  resourcesOptions.appendChild(tableBtn);

  // Add file input for images
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'image/*';
  fileInput.multiple = true;
  fileInput.onchange = (e) => previewImages(e, content);
  resourcesOptions.appendChild(fileInput);

  content.appendChild(resourcesOptions);
  container.appendChild(content);

  // Create subcriteria area (initially hidden with the criteria content)
  const subArea = document.createElement('div');
  subArea.className = 'subcriteria-area';
  content.appendChild(subArea);

  // Add subcriteria if they exist
  crit.sub.forEach((subname, j) => {
    const subContainer = document.createElement('div');
    subContainer.className = 'subcriteria-container';

    // Subcriteria header with dropdown button
    const subHeader = document.createElement('div');
    subHeader.className = 'subcriteria-header';

    const subDropdownBtn = document.createElement('button');
    subDropdownBtn.className = 'dropdown-btn';
    subDropdownBtn.textContent = `${i + 1}.${j + 1}: ${subname}`;
    subDropdownBtn.onclick = function() {
      this.classList.toggle('active');
      const subContent = this.parentElement.nextElementSibling;
      subContent.classList.toggle('active');
    };

    subHeader.appendChild(subDropdownBtn);
    subContainer.appendChild(subHeader);

    // Subcriteria content (initially hidden)
    const subContent = document.createElement('div');
    subContent.className = 'criteria-content';

    // Add textarea for subcriteria
    const subParagraphField = document.createElement('textarea');
    subParagraphField.placeholder = `Write paragraph for ${i + 1}.${j + 1}...`;
    subContent.appendChild(subParagraphField);

    // Add "Add Resources" button for subcriteria
    const subAddResourcesBtn = document.createElement('button');
    subAddResourcesBtn.className = 'add-resources-btn';
    subAddResourcesBtn.textContent = 'Add Resources';
    subAddResourcesBtn.onclick = function() {
      const options = this.nextElementSibling;
      options.classList.toggle('active');
    };
    subContent.appendChild(subAddResourcesBtn);

    // Add resources options for subcriteria (initially hidden)
    const subResourcesOptions = document.createElement('div');
    subResourcesOptions.className = 'resources-options';

    // Add "Create Table" button for subcriteria
    const subTableBtn = document.createElement('button');
    subTableBtn.textContent = 'Create Table';
    subTableBtn.onclick = () => createTable(subContent);
    subResourcesOptions.appendChild(subTableBtn);

    // Add file input for subcriteria images
    const subFileInput = document.createElement('input');
    subFileInput.type = 'file';
    subFileInput.accept = 'image/*';
    subFileInput.multiple = true;
    subFileInput.onchange = (e) => previewImages(e, subContent);
    subResourcesOptions.appendChild(subFileInput);

    subContent.appendChild(subResourcesOptions);
    subContainer.appendChild(subContent);
    subArea.appendChild(subContainer);
  });

  root.appendChild(container);
});

// Rest of the functions remain the same
function createTable(container) {
  const wrapper = document.createElement('div');
  wrapper.className = 'table-container';

  const deleteTableBtn = document.createElement('button');
  deleteTableBtn.className = 'delete-btn';
  deleteTableBtn.textContent = 'Delete Table';
  deleteTableBtn.onclick = () => wrapper.remove();
  wrapper.appendChild(deleteTableBtn);

  const tableId = `table-${tableCount++}`;
  const table = document.createElement('table');
  table.id = tableId;

  const header = table.insertRow();
  const th = document.createElement('th');
  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Column Name';
  th.appendChild(input);
  header.appendChild(th);

  const row = table.insertRow();
  const td = row.insertCell();
  td.contentEditable = true;

  wrapper.appendChild(table);

  const controls = document.createElement('div');
  controls.className = 'controls';

  const addRowBtn = document.createElement('button');
  addRowBtn.textContent = 'Add Row';
  addRowBtn.onclick = () => addRow(tableId);

  const addColBtn = document.createElement('button');
  addColBtn.textContent = 'Add Column';
  addColBtn.onclick = () => addColumn(tableId);

  const delRowBtn = document.createElement('button');
  delRowBtn.textContent = 'Delete Row';
  delRowBtn.onclick = () => deleteRow(tableId);

  const delColBtn = document.createElement('button');
  delColBtn.textContent = 'Delete Column';
  delColBtn.onclick = () => deleteColumn(tableId);

  controls.appendChild(addRowBtn);
  controls.appendChild(addColBtn);
  controls.appendChild(delRowBtn);
  controls.appendChild(delColBtn);

  wrapper.appendChild(controls);
  container.appendChild(wrapper);
}

function addRow(tableId) {
  const table = document.getElementById(tableId);
  const row = table.insertRow();
  const colCount = table.rows[0].cells.length;
  for (let i = 0; i < colCount; i++) {
    row.insertCell().contentEditable = true;
  }
}

function addColumn(tableId) {
  const table = document.getElementById(tableId);
  for (let i = 0; i < table.rows.length; i++) {
    const cell = i === 0 ? document.createElement('th') : table.rows[i].insertCell();
    if (i === 0) {
      const input = document.createElement('input');
      input.type = 'text';
      input.placeholder = 'Column Name';
      cell.appendChild(input);
      table.rows[i].appendChild(cell);
    } else {
      cell.contentEditable = true;
    }
  }
}

function deleteRow(tableId) {
  const table = document.getElementById(tableId);
  if (table.rows.length > 2) {
    table.deleteRow(table.rows.length - 1);
  } else {
    alert("Cannot delete all rows!");
  }
}

function deleteColumn(tableId) {
  const table = document.getElementById(tableId);
  const colCount = table.rows[0].cells.length;
  if (colCount > 1) {
    for (let i = 0; i < table.rows.length; i++) {
      table.rows[i].deleteCell(colCount - 1);
    }
  } else {
    alert("Cannot delete all columns!");
  }
}

function previewImages(event, container) {
  const files = event.target.files;
  [...files].forEach(file => {
    const reader = new FileReader();
    reader.onload = function(e) {
      const imgContainer = document.createElement('div');
      imgContainer.className = 'image-container';
      
      const img = document.createElement('img');
      img.src = e.target.result;
      
      const removeBtn = document.createElement('button');
      removeBtn.className = 'remove-image-btn';
      removeBtn.textContent = 'Remove';
      removeBtn.onclick = function() {
        imgContainer.remove();
      };
      
      imgContainer.appendChild(img);
      imgContainer.appendChild(removeBtn);
      container.appendChild(imgContainer);
    };
    reader.readAsDataURL(file);
  });
}
