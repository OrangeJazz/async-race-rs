import {
  createNewCar,
  updateCar,
  getCar,
  deleteCar,
  deleteWinner,
} from "./api";
import { updateGarage, renderGarage } from "./garageLayout";
import { Car } from "./types";
import { option, data } from "./data";
import { startDriving, stopDriving } from "./race";
import {
  updateWinnersTable,
  renderWinners,
  setSortOrder,
} from "./winnersLayout";
import { paginationListner } from "./pagination";
import { raceEvent, resetRaceEvent, generateCarsEvent } from "./buttonEvents";

let selectedCar: Car | null = null;
export const listen = () => {
  document.body.addEventListener("click", async (e: Event) => {
    const garageDiv = document.querySelector("#garage") as HTMLDivElement;
    const garageViewDiv = document.querySelector(
      "#garage-view"
    ) as HTMLDivElement;
    const winnersDiv = document.querySelector("#winners") as HTMLDivElement;
    const updateNameInput = document.querySelector(
      "#update-name"
    ) as HTMLInputElement;
    const updateColorInput = document.querySelector(
      "#update-color"
    ) as HTMLInputElement;
    const updateBtn = document.querySelector(
      "#update-submit"
    ) as HTMLButtonElement;
    const raceBtn = document.querySelector("#race") as HTMLButtonElement;
    const target = e.target as HTMLElement;

    if (target.classList.contains("garage-menu-button")) {
      garageViewDiv.style.display = "block";
      option.view = "garage";
      updateGarage();
      winnersDiv.style.display = "none";
    }

    if (target.classList.contains("winners-menu-button")) {
      await updateWinnersTable();
      garageViewDiv.style.display = "none";
      winnersDiv.innerHTML = renderWinners(data.winners);
      winnersDiv.style.display = "block";
      option.view = "winners";
    }

    if (target.classList.contains("table-wins")) {
      setSortOrder("wins");
    }

    if (target.classList.contains("table-time")) {
      setSortOrder("time");
    }

    if (target.classList.contains("select-btn")) {
      const carIdSelected = Number(target.id.split("select-car-")[1]);
      selectedCar = await getCar(carIdSelected);
      updateNameInput.value = selectedCar.name;
      updateColorInput.value = selectedCar.color;
      updateNameInput.disabled = false;
      updateColorInput.disabled = false;
      updateBtn.disabled = false;
    }

    if (target.classList.contains("delete-btn")) {
      const carIdSelected = Number(target.id.split("delete-car-")[1]);
      await deleteCar(carIdSelected);
      await updateGarage();
      garageDiv.innerHTML = renderGarage();
      await deleteWinner(carIdSelected);
    }

    if (target.classList.contains("start-engine-btn")) {
      raceBtn.disabled = true;
      const id = Number(target?.id.split("start-engine-car-")[1]);
      startDriving(id);
    }

    if (target.classList.contains("stop-engine-btn")) {
      const id = Number(target?.id.split("stop-engine-car-")[1]);
      stopDriving(id);
      raceBtn.disabled = false;
    }

    if (target.classList.contains("race-btn")) {
      raceEvent(e);
    }

    if (target.classList.contains("reset-btn")) {
      resetRaceEvent(e);
    }
  });

  const createCarForm = document.querySelector("#create") as HTMLFormElement;
  createCarForm.addEventListener("submit", async (e: Event) => {
    e.preventDefault();
    const target = e.target as HTMLButtonElement;
    const garageDiv = document.querySelector("#garage") as HTMLDivElement;
    const createNameInput = document.querySelector(
      "#create-name"
    ) as HTMLInputElement;
    const car: Car = Object.fromEntries(
      new Map(
        Object.values(target)
          .filter(({ name }) => !!name)
          .map(({ value, name }) => [name, value])
      )
    );
    await createNewCar(car);
    await updateGarage();
    garageDiv.innerHTML = renderGarage();
    createNameInput.value = "";
    target.disabled = true;
  });

  const updateCarForm = document.querySelector("#update") as HTMLFormElement;
  updateCarForm.addEventListener("submit", async (e: Event) => {
    e.preventDefault();
    const target = e.target as HTMLButtonElement;
    const garageDiv = document.querySelector("#garage") as HTMLDivElement;
    const updateNameInput = document.querySelector(
      "#update-name"
    ) as HTMLInputElement;
    const updateColorInput = document.querySelector(
      "#update-color"
    ) as HTMLInputElement;
    const updateBtn = document.querySelector(
      "#update-submit"
    ) as HTMLInputElement;
    const car = Object.fromEntries(
      new Map(
        Object.values(target)
          .filter(({ name }) => !!name)
          .map(({ value, name }) => [name, value])
      )
    );
    if (selectedCar && selectedCar.id) await updateCar(selectedCar.id, car);
    await updateGarage();
    garageDiv.innerHTML = renderGarage();
    updateNameInput.value = "";
    updateNameInput.disabled = true;
    updateColorInput.value = "#ffffff";
    updateColorInput.disabled = true;
    updateBtn.disabled = true;
    selectedCar = null;
  });

  const generateCarBtn = document.querySelector(
    "#generator"
  ) as HTMLFormElement;
  generateCarBtn.addEventListener("click", generateCarsEvent);
  paginationListner();
};
