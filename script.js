const chartScript = document.createElement('script');
chartScript.src = 'https://cdn.jsdelivr.net/npm/chart.js';
document.head.appendChild(chartScript);

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

const themeToggle = document.getElementById('theme-toggle');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

const currentTheme = localStorage.getItem('theme') || 
                     (prefersDarkScheme.matches ? 'dark' : 'light');
if (currentTheme === 'dark') {
  document.documentElement.setAttribute('data-theme', 'dark');
  themeToggle.textContent = 'Light Mode';
} else {
  document.documentElement.setAttribute('data-theme', 'light');
  themeToggle.textContent = 'Dark Mode';
}

themeToggle.addEventListener('click', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  if (currentTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.setItem('theme', 'light');
    themeToggle.textContent = 'Dark Mode';
  } else {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
    themeToggle.textContent = 'Light Mode';
  }
});

document.getElementById('reset-all').addEventListener('click', () => {
  if (confirm('Are you sure you want to reset everything? This cannot be undone.')) {
    localStorage.clear();
    document.querySelectorAll('textarea').forEach(ta => {
      ta.value = '';
    });
    document.querySelectorAll('.table-container, .image-container').forEach(el => {
      el.remove();
    });
  }
});

// Save to Database functionality
document.getElementById('save-to-db').addEventListener('click', () => {
  // Collect all text content
  const allTextareas = document.querySelectorAll('textarea');
  const textData = [];
  
  allTextareas.forEach((ta, index) => {
    const parentElement = ta.closest('.criteria-content, .subcriteria-container');
    const header = parentElement.querySelector('.dropdown-btn')?.textContent || 'Untitled';
    
    textData.push({
      id: index,
      header: header,
      text: ta.value
    });
  });

  // Collect all tables
  const tables = [];
  document.querySelectorAll('.table-container').forEach((tableContainer, index) => {
    const table = tableContainer.querySelector('table');
    const tableData = {
      id: `table-${index}`,
      headers: [],
      rows: []
    };

    // Get headers
    const headerRow = table.rows[0];
    for (let i = 0; i < headerRow.cells.length; i++) {
      const input = headerRow.cells[i].querySelector('input');
      tableData.headers.push(input ? input.value : `Column ${i + 1}`);
    }

    // Get rows
    for (let i = 1; i < table.rows.length; i++) {
      const row = table.rows[i];
      const rowData = [];
      
      for (let j = 0; j < row.cells.length; j++) {
        rowData.push(row.cells[j].textContent);
      }
      
      tableData.rows.push(rowData);
    }

    tables.push(tableData);
  });

  // Collect all images (as base64 strings)
  const images = [];
  document.querySelectorAll('.image-container').forEach((imgContainer, index) => {
    const img = imgContainer.querySelector('img');
    const nameInput = imgContainer.querySelector('.image-name-input');
    
    images.push({
      id: `image-${index}`,
      name: nameInput ? nameInput.value : `Image ${index + 1}`,
      data: img.src // This is the base64 encoded image
    });
  });

  // Prepare the complete data object
  const dataToSend = {
    textData: textData,
    tables: tables,
    images: images,
    timestamp: new Date().toISOString()
  };

  // Send to server
  fetch('save_data.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(dataToSend)
  })
  .then(res => res.text())
  .then(response => {
    alert("Data saved successfully!\nServer Response: " + response);
  })
  .catch(err => {
    console.error("Error:", err);
    alert("Failed to save data. Please check console for details.");
  });
});

criteriaData.forEach((crit, i) => {
  const root = document.getElementById('criteria-root');

  const container = document.createElement('div');
  container.className = 'criteria-container';

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

  const content = document.createElement('div');
  content.className = 'criteria-content';

  const paragraphField = document.createElement('textarea');
  paragraphField.placeholder = `Write paragraph for Criteria ${i + 1}...`;
  content.appendChild(paragraphField);

  const addResourcesBtn = document.createElement('button');
  addResourcesBtn.className = 'add-resources-btn';
  addResourcesBtn.textContent = 'Add Resources';
  addResourcesBtn.onclick = function() {
    const options = this.nextElementSibling;
    options.classList.toggle('active');
  };
  content.appendChild(addResourcesBtn);

  const resourcesOptions = document.createElement('div');
  resourcesOptions.className = 'resources-options';

  const tableBtn = document.createElement('button');
  tableBtn.textContent = 'Create Table';
  tableBtn.onclick = () => createTable(content);
  resourcesOptions.appendChild(tableBtn);

  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'image/*';
  fileInput.multiple = true;
  fileInput.onchange = (e) => previewImages(e, content);
  resourcesOptions.appendChild(fileInput);

  content.appendChild(resourcesOptions);
  container.appendChild(content);

  const subArea = document.createElement('div');
  subArea.className = 'subcriteria-area';
  content.appendChild(subArea);

  crit.sub.forEach((subname, j) => {
    const subContainer = document.createElement('div');
    subContainer.className = 'subcriteria-container';

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

    const subContent = document.createElement('div');
    subContent.className = 'criteria-content';

    const subParagraphField = document.createElement('textarea');
    subParagraphField.placeholder = `Write paragraph for ${i + 1}.${j + 1}...`;
    subContent.appendChild(subParagraphField);

    const subAddResourcesBtn = document.createElement('button');
    subAddResourcesBtn.className = 'add-resources-btn';
    subAddResourcesBtn.textContent = 'Add Resources';
    subAddResourcesBtn.onclick = function() {
      const options = this.nextElementSibling;
      options.classList.toggle('active');
    };
    subContent.appendChild(subAddResourcesBtn);

    const subResourcesOptions = document.createElement('div');
    subResourcesOptions.className = 'resources-options';

    const subTableBtn = document.createElement('button');
    subTableBtn.textContent = 'Create Table';
    subTableBtn.onclick = () => createTable(subContent);
    subResourcesOptions.appendChild(subTableBtn);

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

function createTable(container) {
  const wrapper = document.createElement('div');
  wrapper.className = 'table-container';

  const deleteTableBtn = document.createElement('button');
  deleteTableBtn.className = 'delete-btn';
  deleteTableBtn.textContent = 'Delete Table';
  deleteTableBtn.onclick = () => wrapper.remove();

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

  const generateGraphBtn = document.createElement('button');
  generateGraphBtn.className = 'graph-btn';
  generateGraphBtn.textContent = 'Generate Graph';
  generateGraphBtn.onclick = function() {
    const options = this.nextElementSibling;
    options.classList.toggle('active');
  };

  const graphOptions = document.createElement('div');
  graphOptions.className = 'graph-options';

  const barChartBtn = document.createElement('button');
  barChartBtn.className = 'graph-btn';
  barChartBtn.textContent = 'Bar Chart';
  barChartBtn.onclick = () => generateChart(tableId, 'bar');

  const pieChartBtn = document.createElement('button');
  pieChartBtn.className = 'graph-btn';
  pieChartBtn.textContent = 'Pie Chart';
  pieChartBtn.onclick = () => generateChart(tableId, 'pie');

  const lineChartBtn = document.createElement('button');
  lineChartBtn.className = 'graph-btn';
  lineChartBtn.textContent = 'Line Chart';
  lineChartBtn.onclick = () => generateChart(tableId, 'line');

  graphOptions.appendChild(barChartBtn);
  graphOptions.appendChild(pieChartBtn);
  graphOptions.appendChild(lineChartBtn);

  controls.appendChild(addRowBtn);
  controls.appendChild(addColBtn);
  controls.appendChild(delRowBtn);
  controls.appendChild(delColBtn);
  controls.appendChild(deleteTableBtn);
  controls.appendChild(generateGraphBtn);
  controls.appendChild(graphOptions);

  wrapper.appendChild(controls);

  const subArea = container.querySelector('.subcriteria-area');
  if (subArea) {
    container.insertBefore(wrapper, subArea);
  } else {
    container.appendChild(wrapper);
  }
}

function addRow(tableId) {
  const table = document.getElementById(tableId);
  const row = table.insertRow();
  const rowNumber = table.rows.length - 1;
  
  const colCount = table.rows[0].cells.length;
  for (let i = 0; i < colCount; i++) {
    const cell = row.insertCell();
    cell.contentEditable = true;
    if (i === 0) {
      cell.textContent = '';
      cell.setAttribute('placeholder', `Row ${rowNumber}`);
    }
  }
}

function addColumn(tableId) {
  const table = document.getElementById(tableId);
  const colName = prompt("Enter column name:", `Column ${table.rows[0].cells.length + 1}`);
  
  for (let i = 0; i < table.rows.length; i++) {
    const cell = i === 0 ? document.createElement('th') : table.rows[i].insertCell();
    if (i === 0) {
      const input = document.createElement('input');
      input.type = 'text';
      input.value = colName || `Column ${table.rows[0].cells.length + 1}`;
      cell.appendChild(input);
      table.rows[i].appendChild(cell);
    } else {
      cell.contentEditable = true;
    }
  }
}

function deleteRow(tableId) {
  const table = document.getElementById(tableId);
  if (table.rows.length <= 2) {
    alert("Cannot delete all rows!");
    return;
  }

  const rowOptions = Array.from(table.rows).slice(1).map((row, index) => {
    const firstCellText = row.cells[0].textContent.trim();
    return firstCellText ? `${index + 1}: ${firstCellText}` : `Row ${index + 1}`;
  });

  const selectedRow = prompt(`Which row to delete?\n${rowOptions.join('\n')}`);
  if (!selectedRow) return;

  const rowIndex = parseInt(selectedRow.match(/\d+/)[0]);
  if (rowIndex >= 1 && rowIndex <= table.rows.length - 1) {
    table.deleteRow(rowIndex); 
  } else {
    alert("Invalid row selection!");
  }
}

function deleteColumn(tableId) {
  const table = document.getElementById(tableId);
  const colCount = table.rows[0].cells.length;
  if (colCount <= 1) {
    alert("Cannot delete all columns!");
    return;
  }

  const colOptions = Array.from(table.rows[0].cells).map((cell, index) => {
    const input = cell.querySelector('input');
    const colName = input ? input.value || `Column ${index + 1}` : `Column ${index + 1}`;
    return colName;
  });

  const selectedCol = prompt(`Which column to delete?\n${colOptions.join('\n')}`);
  if (!selectedCol) return;
  let colIndex = -1;
  for (let i = 0; i < colOptions.length; i++) {
    if (colOptions[i] === selectedCol) {
      colIndex = i;
      break;
    }
  }

  if (colIndex === -1) {
    const match = selectedCol.match(/column (\d+)/i);
    if (match) {
      colIndex = parseInt(match[1]) - 1;
    }
  }

  if (colIndex >= 0 && colIndex < colCount) {
    for (let i = 0; i < table.rows.length; i++) {
      table.rows[i].deleteCell(colIndex);
    }
  } else {
    alert("Invalid column selection!");
  }
}

function previewImages(event, container) {
  const files = event.target.files;
  [...files].forEach(file => {
    const reader = new FileReader();
    reader.onload = function(e) {
      const imgContainer = document.createElement('div');
      imgContainer.className = 'image-container';
      
      const nameInput = document.createElement('input');
      nameInput.type = 'text';
      nameInput.placeholder = 'Enter image name';
      nameInput.className = 'image-name-input';
      
      const img = document.createElement('img');
      img.src = e.target.result;
      
      const removeBtn = document.createElement('button');
      removeBtn.className = 'remove-image-btn';
      removeBtn.textContent = 'X';
      removeBtn.onclick = function() {
        imgContainer.remove();
      };
      
      imgContainer.appendChild(nameInput);
      imgContainer.appendChild(img);
      imgContainer.appendChild(removeBtn);
      container.appendChild(imgContainer);
    };
    reader.readAsDataURL(file);
  });
}

function generateChart(tableId, chartType) {
  const table = document.getElementById(tableId);
  if (!table) return;

  const existingChart = document.getElementById(`${tableId}-chart`);
  if (existingChart) existingChart.remove();

  const headers = [];
  const data = [];
  const labels = [];

  const headerRow = table.rows[0];
  for (let i = 1; i < headerRow.cells.length; i++) {
    const input = headerRow.cells[i].querySelector('input');
    headers.push(input ? input.value : `Column ${i}`);
  }

  for (let i = 1; i < table.rows.length; i++) {
    const row = table.rows[i];
    const rowData = [];

    const labelText = row.cells[0].textContent.trim() || `Row ${i}`;
    labels.push(labelText);

    for (let j = 1; j < row.cells.length; j++) {
      const value = parseFloat(row.cells[j].textContent) || 0;
      rowData.push(value);
    }

    data.push(rowData);
  }

  if (data.length === 0 || headers.length === 0) {
    alert('Please add data to the table first!');
    return;
  }

  const chartContainer = document.createElement('div');
  chartContainer.className = 'chart-container';
  chartContainer.id = `${tableId}-chart`;

  const removeChartBtn = document.createElement('button');
  removeChartBtn.className = 'remove-chart-btn';
  removeChartBtn.textContent = '×';
  removeChartBtn.onclick = () => chartContainer.remove();

  const canvas = document.createElement('canvas');
  chartContainer.appendChild(canvas);
  chartContainer.appendChild(removeChartBtn);
  table.parentNode.insertBefore(chartContainer, table.nextSibling);

  const pastelColors = [
    '#f8b195', '#f67280', '#c06c84', '#6c5b7b', '#355c7d',
    '#99b898', '#feceab', '#ff847c', '#e84a5f', '#2a363b'
  ];

  const chartOptions = {
    responsive: true,
    animation: {
      duration: 1000,
      easing: 'easeOutQuart'
    },
    layout: {
      padding: 20
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: getComputedStyle(document.documentElement).getPropertyValue('--text-color'),
          font: {
            size: 14,
            family: "'Segoe UI', sans-serif"
          }
        }
      },
      tooltip: {
        backgroundColor: '#222',
        titleColor: '#fff',
        bodyColor: '#ddd',
        borderColor: '#666',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8
      },
      title: {
        display: true,
        text: `${chartType.charAt(0).toUpperCase() + chartType.slice(1)} Chart`,
        color: getComputedStyle(document.documentElement).getPropertyValue('--text-color'),
        font: {
          size: 18,
          family: "'Segoe UI', sans-serif"
        },
        padding: {
          top: 10,
          bottom: 20
        }
      }
    }
  };

  if (chartType === 'pie') {
    new Chart(canvas, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: data.map(row => row[0]),
          backgroundColor: pastelColors.slice(0, labels.length),
          borderColor: '#fff',
          borderWidth: 2,
          hoverOffset: 10
        }]
      },
      options: chartOptions
    });
  } else {
    const datasets = data.map((d, idx) => ({
      label: labels[idx],
      data: d,
      backgroundColor: pastelColors[idx % pastelColors.length] + 'cc',
      borderColor: pastelColors[idx % pastelColors.length],
      borderWidth: 2,
      tension: 0.4, // for line smoothing
      fill: chartType === 'line'
    }));

    new Chart(canvas, {
      type: chartType,
      data: {
        labels: headers,
        datasets: datasets
      },
      options: chartOptions
    });
  }
}

function getRandomColors(count) {
  const colors = [];
  for (let i = 0; i < count; i++) {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    colors.push(`rgba(${r}, ${g}, ${b}, 0.7)`);
  }
  return colors;
}
