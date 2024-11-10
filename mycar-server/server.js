const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 1337;

app.use(cors());
app.use(bodyParser.json());

let cars = []; // Це буде наш масив для зберігання автомобілів

app.get('/', (req, res) => {
  res.send('Welcome to the MyCar API!'); // Відповідь на GET запит до кореневого шляху
});

// Отримати всі автомобілі
app.get('/api/cars', (req, res) => {
  res.json(cars);
});

// Додати новий автомобіль
app.post('/api/cars', (req, res) => {
  const newCar = { id: uuidv4(), ...req.body };
  cars.push(newCar);
  res.status(201).json(newCar);
});

// Оновити автомобіль
app.patch('/api/cars/:id', (req, res) => {
  const carId = req.params.id;
  const carIndex = cars.findIndex(car => car.id === carId);
  if (carIndex !== -1) {
    cars[carIndex] = { ...cars[carIndex], ...req.body };
    res.json(cars[carIndex]);
  } else {
    res.status(404).send('Car not found');
  }
});

// Видалити автомобіль
app.delete('/api/cars/:id', (req, res) => {
  const carId = req.params.id;
  cars = cars.filter(car => car.id !== carId);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
