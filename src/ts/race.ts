import { data } from "./data";
import { Car, CarInRace, WinnerCar, Engine, Animation } from "./types";
import { startEngine, stopEngine, driveCar } from "./api";

const getPosition = (element: HTMLElement) => {
  const { top, left, width, height } = element.getBoundingClientRect();
  return {
    x: left + width / 2,
    y: top + height / 2,
  };
};

export const getDistanceBetweenElements = (
  firstEl: HTMLElement,
  secondEl: HTMLElement
) => {
  const aPosition = getPosition(firstEl);
  const bPosition = getPosition(secondEl);
  return Math.hypot(aPosition.x - bPosition.x, aPosition.y - bPosition.y);
};

export function animation(
  carDiv: HTMLElement,
  distance: number,
  animationTime: number
) {
  let start: number | null = null;
  const state: Animation = {};
  function step(timestamp: number) {
    if (!start) start = timestamp;
    const time = timestamp - start;
    const passed = Math.round(time * (distance / animationTime));
    carDiv.style.transform = `translateX(${Math.min(passed, distance)}px)`;
    if (passed < distance) {
      state.id = window.requestAnimationFrame(step);
    }
  }
  state.id = window.requestAnimationFrame(step);
  return state;
}

export const raceAll: (
  promises: Promise<CarInRace>[],
  ids: number[]
) => Promise<WinnerCar> = async (
  promises: Promise<CarInRace>[],
  ids: number[]
) => {
  const { success, id, time } = await Promise.race(promises);
  if (!success) {
    const failedIndex = ids.findIndex((i) => i === id);
    const restPromises = [
      ...promises.slice(0, failedIndex),
      ...promises.slice(failedIndex + 1, promises.length),
    ];
    const restIds = [
      ...ids.slice(0, failedIndex),
      ...ids.slice(failedIndex + 1, ids.length),
    ];
    return raceAll(restPromises, restIds);
  }
  const winnerCar = data.cars.find((car) => car.id === id) as Car;
  const winner = { car: winnerCar, time: +(time / 1000).toFixed(2) };
  return winner;
};

export const race = async (action: (id: number) => Promise<CarInRace>) => {
  const promises = data.cars.map((car) => {
    const carID = car.id as number;
    return action(carID);
  });
  const carsId = data.cars.map((car) => car.id) as number[];
  const winner: WinnerCar = await raceAll(promises, carsId);
  return winner;
};

export const startDriving = async (id: number) => {
  const startButton = document.querySelector(
    `#start-engine-car-${id}`
  ) as HTMLButtonElement;
  const stopButton = document.querySelector(
    `#stop-engine-car-${id}`
  ) as HTMLButtonElement;
  startButton.disabled = true;
  startButton.classList.toggle("enabling", true);
  const carEngine: Engine = await startEngine(id);
  const time = Math.round(carEngine.distance / carEngine.velocity);
  const car = document.querySelector(`#car-${id}`) as HTMLElement;
  const flag = document.querySelector(`#flag-${id}`) as HTMLElement;
  const htmlDistance = Math.floor(getDistanceBetweenElements(car, flag)) + 15;
  data.animation[id] = animation(car, htmlDistance, time);
  startButton.classList.toggle("enabling", false);
  stopButton.disabled = false;
  const { success } = await driveCar(id);
  const animationId = data.animation[id].id as number;
  if (!success) window.cancelAnimationFrame(animationId);
  const res: CarInRace = {
    success,
    id,
    time,
  };
  return res;
};

export const stopDriving = async (id: number) => {
  const startButton = document.querySelector(
    `#start-engine-car-${id}`
  ) as HTMLButtonElement;
  const stopButton = document.querySelector(
    `#stop-engine-car-${id}`
  ) as HTMLButtonElement;
  stopButton.disabled = true;
  stopButton?.classList.toggle("enabling", true);
  await stopEngine(id);
  stopButton?.classList.toggle("enabling", false);
  startButton.disabled = false;
  const car = document.querySelector(`#car-${id}`) as HTMLElement;
  car.style.transform = `translateX(0)`;
  const animationId = data.animation[id].id as number;
  if (data.animation[id]) window.cancelAnimationFrame(animationId);
};
