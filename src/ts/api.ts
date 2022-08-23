import { Car, WinnerList } from "./types";
import { CarInRace } from "./types";
import { WinnerCar } from "./types";
import { WinnerStat } from "./types";
import { Drive } from "./types";
import { Engine } from "./types";
import { option } from "./data";
const base = "http://localhost:3000";
const garage = `${base}/garage`;
const engine = `${base}/engine`;
const winners = `${base}/winners`;

const getSort = (sort: string, order: string) => {
  if (sort && order) return `&_sort=${sort}&_order=${order}`;
  return "";
};

export const getCar = async (id: number) =>
  (await fetch(`${garage}/${id}`)).json() as Promise<Car>;

export const getAllCars = async (page: number, limit = 7) => {
  const response = await fetch(`${garage}?_page=${page}&_limit=${limit}`);
  return {
    items: (await response.json()) as Car[],
    count: response.headers.get("X-Total-Count"),
  };
};

export const createNewCar = async (body: Car) =>
  (
    await fetch(garage, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    })
  ).json() as Promise<Car>;

export const updateCar = async (id: number, body: Car) =>
  (
    await fetch(`${garage}/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    })
  ).json() as Promise<Car>;

export const deleteCar = async (id: number) =>
  (await fetch(`${garage}/${id}`, { method: "DELETE" })).json() as Promise<Car>;

export const startEngine = async (id: number) => {
  return (
    await fetch(`${engine}?id=${id}&status=started`, {
      method: "PATCH",
    })
  ).json() as Promise<Engine>;
};

export const stopEngine = async (id: number) =>
  (
    await fetch(`${engine}?id=${id}&status=stopped`, {
      method: "PATCH",
    })
  ).json() as Promise<Engine>;

export const driveCar: (id: number) => Promise<Drive> = async (id: number) => {
  const res = await fetch(`${engine}?id=${id}&status=drive`, {
    method: "PATCH",
  }).catch();
  return res.status !== 200 ? { success: false } : { ...(await res.json()) };
};

export const getAllWinners = async (page: number, limit = 10) => {
  const response = await fetch(
    `${winners}?_page=${page}&_limit=${limit}${getSort(
      option.sortBy,
      option.sortOrder
    )}`
  );
  const items = await response.json();
  return {
    items: (await Promise.all(
      items.map(async (winners: CarInRace) => ({
        ...winners,
        car: await getCar(winners.id as number),
      }))
    )) as WinnerList[],
    count: Number(response.headers.get("X-Total-Count")),
  };
};

export const getWinner = async (id: number) =>
  (await fetch(`${winners}/${id}`)).json();
export const getWinnerStatus = async (id: number) =>
  (await fetch(`${winners}/${id}`)).status;
export const deleteWinner = async (id: number) =>
  (await fetch(`${winners}/${id}`, { method: "DELETE" })).json();
export const createWinner = async (body: WinnerStat) =>
  (
    await fetch(winners, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    })
  ).json();

export const updateWinner = async (id: number, body: WinnerStat) =>
  (
    await fetch(`${winners}/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    })
  ).json();

export const saveWinner = async (car: WinnerCar) => {
  const id = car.car.id as number;
  const winnerStatus = await getWinnerStatus(id);
  if (winnerStatus === 404) {
    const winnerStat: WinnerStat = {
      id: id,
      wins: 1,
      time: car.time,
    };
    await createWinner(winnerStat);
  } else {
    const winner = await getWinner(id);
    const winnerStat: WinnerStat = {
      id: id,
      wins: winner.wins + 1,
      time: car.time < winner.time ? car.time : winner.time,
    };
    await updateWinner(id, winnerStat);
  }
};
