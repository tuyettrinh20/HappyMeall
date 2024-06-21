'use strict'

const api = "http://localhost:3001/api/ingredient"
const dataContainer = document.getElementById('data-container');
function groupDataByFirstLetter(data) {
    const groupedData = {};

    for (const item of data) {
      const firstLetter = item.name_in[0].toUpperCase();

      if (!groupedData[firstLetter]) {
        groupedData[firstLetter] = [];
      }

      groupedData[firstLetter].push(item);
    }

    return groupedData;
  }

function renderData(groupedData) {
    for (const [firstLetter, items] of Object.entries(groupedData)) {
      const groupContainer = document.createElement('div');
      groupContainer.classList.add('group-container');

      const groupTitle = document.createElement('h3');
      groupTitle.classList.add('group-title');
      groupTitle.textContent = firstLetter;
      const space = document.createElement('div');
      space.classList.add('space1');
      groupContainer.appendChild(groupTitle);
      groupContainer.appendChild(space);
      

      for (const item of items) {
        var listItem = document.createElement('a');
        listItem.setAttribute('href',"http://localhost:3001/ingredient/"+ item.name_in);
        listItem.classList.add('list-item');
        listItem.textContent = `${item.name_in}`;
        groupContainer.appendChild(listItem);
      }

      dataContainer.appendChild(groupContainer);
    }
  }

fetch(api)
    .then(res => res.json())
    .then((data) => {
        const groupedData = groupDataByFirstLetter(data);
        renderData(groupedData);
    });