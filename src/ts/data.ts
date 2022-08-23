import { getAllCars, getAllWinners } from "./api";
import { Car, WinnerList, Animation } from "./types";

const allCars = await getAllCars(1);
const cars = allCars.items as Car[];
const carsCount = Number(allCars.count);

export const option = {
  view: "garage",
  sortBy: "time",
  sortOrder: "asc",
};
const allWinners = await getAllWinners(1);
const winners = allWinners.items as WinnerList[];
const winnersCount = Number(allWinners.count);
const animation: Animation[] = [];
export const data = {
  cars: cars,
  carsCount: carsCount,
  carsPage: 1,
  winnersPage: 1,
  winners: winners,
  winnersCount: winnersCount,
  animation: animation,
};
