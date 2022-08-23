import { generateRandomCars } from "./carGenerator";
import { createNewCar, saveWinner } from "./api";
import { renderGarage, updateGarage } from "./garageLayout";
import { WinnerCar } from "./types";
import { data } from "./data";
import { race, startDriving, stopDriving } from "./race";

export const raceEvent = async (e: Event) => {
  const message = document.querySelector("#message") as HTMLElement;
  const winnersMenuBtn = document.querySelector(
    "#winners-menu"
  ) as HTMLButtonElement;
  const target = e.target as HTMLButtonElement;
  target.disabled = true;
  winnersMenuBtn.disabled = true;
  const winner = (await race(startDriving)) as WinnerCar;
  await saveWinner(winner);
  data.winnersCount++;
  message.innerHTML = `${winner.car.name} went first (${winner.time}s)!`;
  message.classList.toggle("visible", true);
  const resetBtn = document.querySelector("#reset") as HTMLButtonElement;
  resetBtn.disabled = false;
  winnersMenuBtn.disabled = false;
};

export const resetRaceEvent = (e: Event) => {
  const target = e.target as HTMLButtonElement;
  target.disabled = true;
  data.cars.map((car) => {
    const carID = car.id as number;
    return stopDriving(carID);
  });
  const message = document.querySelector("#message") as HTMLElement;
  message.classList.toggle("visible", false);
  const raceBtn = document.querySelector("#race") as HTMLButtonElement;
  raceBtn.disabled = false;
};

export const generateCarsEvent = async (e: Event) => {
  const target = e.target as HTMLButtonElement;
  const garageDiv = document.querySelector("#garage") as HTMLDivElement;
  target.disabled = true;
  const cars = generateRandomCars();
  await Promise.all(cars.map(async (car) => await createNewCar(car)));
  await updateGarage();
  garageDiv.innerHTML = renderGarage();
  target.disabled = false;
};
