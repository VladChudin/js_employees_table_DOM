'use strict';

const sortDirection = {};

const thead = document.querySelector('thead');
const tbody = document.querySelector('tbody');

tbody.addEventListener('click', (e) => {
  const row = e.target.closest('tr');

  if (!row) {
    return;
  }

  tbody.querySelectorAll('tr').forEach((r) => {
    r.classList.remove('active');
  });

  row.classList.add('active');
});

thead.addEventListener('click', (e) => {
  const th = e.target.closest('th');

  if (!th) {
    return;
  }

  const index = th.cellIndex;
  const rows = Array.from(tbody.querySelectorAll('tr'));

  let direction = sortDirection[index];

  if (!direction || direction === 'desc') {
    direction = 'asc';
  } else {
    direction = 'desc';
  }

  sortDirection[index] = direction;

  rows.sort((a, b) => {
    const cellA = a.querySelectorAll('td')[index].textContent.trim();
    const cellB = b.querySelectorAll('td')[index].textContent.trim();

    let result;

    const numA = Number(cellA.replace(/[^\d]/g, ''));
    const numB = Number(cellB.replace(/[^\d]/g, ''));

    if (!Number.isNaN(numA) && !Number.isNaN(numB) && numA && numB) {
      result = numA - numB;
    } else {
      result = cellA.localeCompare(cellB);
    }

    if (direction === 'desc') {
      result = -result;
    }

    return result;
  });

  rows.forEach((row) => tbody.appendChild(row));
});

const form = document.createElement('form');

form.className = 'new-employee-form';

const fields = [
  { label: 'Name', name: 'name', type: 'text' },
  { label: 'Position', name: 'position', type: 'text' },
  { label: 'Office', name: 'office', type: 'select' },
  { label: 'Age', name: 'age', type: 'number' },
  { label: 'Salary', name: 'salary', type: 'number' },
];

const inputs = {};

fields.forEach((field) => {
  const label = document.createElement('label');

  label.textContent = `${field.label}: `;

  let input;

  if (field.type === 'select') {
    input = document.createElement('select');

    [
      'Tokyo',
      'Singapore',
      'London',
      'New York',
      'Edinburgh',
      'San Francisco',
    ].forEach((city) => {
      const option = document.createElement('option');

      option.value = city;
      option.textContent = city;
      input.appendChild(option);
    });
  } else {
    input = document.createElement('input');
    input.type = field.type;
  }

  input.name = field.name;
  input.setAttribute('data-qa', field.name);

  inputs[field.name] = input;
  label.appendChild(input);
  form.appendChild(label);
});

const submitBtn = document.createElement('button');

submitBtn.type = 'submit';
submitBtn.textContent = 'Save to table';
form.appendChild(submitBtn);

document.body.appendChild(form);

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const employeeName = inputs.name.value.trim();
  const position = inputs.position.value.trim();
  const office = inputs.office.value;
  const age = Number(inputs.age.value);
  const salary = Number(inputs.salary.value);

  if (employeeName.length < 4) {
    showNotification('Name должен быть не менее 4 символов', 'error');

    return;
  }

  if (age < 18 || age > 90) {
    showNotification('Age должен быть от 18 до 90', 'error');

    return;
  }

  if (!salary || salary <= 0) {
    showNotification('Введите корректную зарплату', 'error');

    return;
  }

  const tr = document.createElement('tr');

  const formattedSalary = `$${salary.toLocaleString('en-US')}`;

  [employeeName, position, office, age, formattedSalary].forEach((value) => {
    const td = document.createElement('td');

    td.textContent = value;
    tr.appendChild(td);
  });

  tbody.appendChild(tr);
  form.reset();

  showNotification('Сотрудник успешно добавлен!', 'success');
});

function showNotification(text, type) {
  const div = document.createElement('div');

  div.textContent = text;
  div.className = type;
  div.setAttribute('data-qa', 'notification');
  document.body.appendChild(div);
  setTimeout(() => div.remove(), 2000);
}

tbody.addEventListener('dblclick', (e) => {
  const td = e.target.closest('td');

  if (!td) {
    return;
  }

  if (td.querySelector('input')) {
    return;
  }

  const oldValue = td.textContent.trim();
  const input = document.createElement('input');

  input.type = 'text';
  input.value = oldValue;

  td.textContent = '';
  td.appendChild(input);
  input.focus();

  input.addEventListener('keydown', (ee) => {
    if (ee.key !== 'Enter') {
      return;
    }

    const newValue = input.value.trim();

    td.textContent = newValue || oldValue;
  });

  input.addEventListener('blur', () => {
    td.textContent = oldValue;
  });
});
