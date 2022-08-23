const brands = [
  "Tesla",
  "Mazda",
  "BMW",
  "Fiat",
  "Audi",
  "Citroen",
  "Opel",
  "Chevrolet",
  "Daewoo",
];
const models = [
  "Model S",
  "X5",
  "C3",
  "Corolla",
  "Nexia",
  "A5",
  "Astra",
  "Aveo",
  "Panda",
];
const carGenerateCount = 100;
const maxColorInHEX = 16777215;

const getName = () => {
  const brand = brands[Math.floor(Math.random() * brands.length)];
  const model = models[Math.floor(Math.random() * models.length)];
  return `${brand} ${model}`;
};

const getColor = () => {
  let randomColorNumber = Math.floor(Math.random() * maxColorInHEX).toString(
    16
  );
  while (randomColorNumber.length < 6) randomColorNumber += "0";

  const color = "#" + randomColorNumber;
  return color;
};

export const generateRandomCars = (count = carGenerateCount) =>
  new Array(count).fill(1).map(() => ({ name: getName(), color: getColor() }));
