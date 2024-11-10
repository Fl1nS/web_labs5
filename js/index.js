// Імпортуємо функції API
import { getAllCars, postCar, updateCar, deleteCar } from './api.js';

const EDIT_BUTTON_PREFIX = 'edit-button-';

const titleInput = document.getElementById("title_input");
const descriptionInput = document.getElementById("description_input");
const speedInput = document.getElementById("speed_input");
const priceInput = document.getElementById("price_input");
const itemsContainer = document.getElementById("items_container");
const dropContainer = document.getElementById("drop_container");

const findInput = document.getElementById("find_input");
const findButton = document.getElementById("find_button");
const cancelFindButton = document.getElementById("cancel_find_button");
const countPriceButton = document.getElementById("count_price_button");
const totalPriceContainer = document.getElementById("total_price");

let items = [];

// Шаблон для відображення картки
const itemTemplate = ({ id, title, description, speed, price }) => `
<li id="${id}" class="card mb-3 item-card" draggable="true" style="width: 18rem;">
  <img src="assets/car.jpg" class="item-container__image card-img-top" alt="car image">
  <div class="card-body">
    <h5 class="card-title">${title}</h5>
    <p class="card-text">Engine Power: ${description}</p>
    <p class="card-text">Max Speed: ${speed} km/h</p>
    <p class="card-text">Price: $${price}</p>
    <button id="${EDIT_BUTTON_PREFIX}${id}" type="button" class="btn btn-info">Edit</button>
  </div>
</li>`;

// Очищення інпутів
const clearInputs = () => {
  titleInput.value = "";
  descriptionInput.value = "";
  speedInput.value = "";
  priceInput.value = "";
};

// Додавання елемента на сторінку
const addItemToPage = ({ id, title, description, speed, price }) => {
  itemsContainer.insertAdjacentHTML("afterbegin", itemTemplate({ id, title, description, speed, price }));

  const element = document.getElementById(id);
  const editButton = document.getElementById(`${EDIT_BUTTON_PREFIX}${id}`);

  element.addEventListener('dragstart', (event) => {
    event.dataTransfer.setData('text/plain', id); 
    setTimeout(() => { element.style.display = 'none'; }, 0);
  });

  element.addEventListener('dragend', () => {
    element.style.display = 'block'; 
  });

  // Обробник для редагування машини
  editButton.addEventListener("click", async () => {
    const newTitle = prompt("Enter new car name:", title);
    const newDescription = prompt("Enter new engine power:", description);
    const newSpeed = prompt("Enter new max speed:", speed);
    const newPrice = prompt("Enter new price:", price);

    if (newTitle && newDescription && newSpeed && newPrice) {
      const updatedCar = { title: newTitle, description: newDescription, speed: newSpeed, price: newPrice };
      await updateCar(id, updatedCar); 
      fetchCars(); 
    }
  });
};

// Функція рендерингу списку елементів
const renderItemsList = async () => {
  itemsContainer.innerHTML = "";
  for (const item of items) {
    addItemToPage(item);
  }
};

// Отримуємо та показуємо список машин із сервера
const fetchCars = async () => {
  items = await getAllCars();
  renderItemsList();
};

// Отримуємо значення з інпутів
const getInputValues = () => ({
  title: titleInput.value,
  description: descriptionInput.value,
  speed: speedInput.value,
  price: priceInput.value,
});

// Пошук по назві машини
findButton.addEventListener("click", () => {
  const searchTerm = findInput.value.toLowerCase();
  const filteredItems = items.filter(item => item.title.toLowerCase().includes(searchTerm));
  renderItemsList(filteredItems);
});

cancelFindButton.addEventListener("click", () => {
  findInput.value = "";
  fetchCars();
});

// Підрахунок загальної ціни
countPriceButton.addEventListener("click", () => {
  const totalPrice = items.reduce((sum, item) => sum + parseFloat(item.price), 0);
  totalPriceContainer.innerHTML = `<h5>Total Price: $${totalPrice.toFixed(2)}</h5>`;
});

// Додавання нової машини
document.getElementById("submit_button").addEventListener("click", async (event) => {
  event.preventDefault();
  const newItem = getInputValues();
  await postCar(newItem);  
  fetchCars();
  clearInputs();
});

// Видалення машини через перетягування на корзину
dropContainer.addEventListener('dragover', (event) => {
  event.preventDefault();
});

dropContainer.addEventListener('drop', async (event) => {
  event.preventDefault();
  const id = event.dataTransfer.getData('text/plain');
  await deleteCar(id); 
  fetchCars();  
});

// Сортування машин за ціною
const sortPriceButton = document.getElementById("sort_price_button");

sortPriceButton.addEventListener("click", () => {
  items.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
  renderItemsList();
});

// Ініціалізація завантаження машин із сервера
fetchCars();
