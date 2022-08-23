import { option, data } from "./data";
import { renderGarage, updateGarage } from "./garageLayout";
import { updateWinnersTable, renderWinners } from "./winnersLayout";

export const paginationListner = () => {
  const prevPageBtn = document.querySelector("#prev") as HTMLButtonElement;
  prevPageBtn.addEventListener("click", async () => {
    const garageDiv = document.querySelector("#garage") as HTMLDivElement;
    const winnersDiv = document.querySelector("#winners") as HTMLDivElement;
    switch (option.view) {
      case "garage": {
        data.carsPage--;
        await updateGarage();
        garageDiv.innerHTML = renderGarage();
        break;
      }
      case "winners": {
        prevPageBtn.disabled = true;
        data.winnersPage--;
        await updateWinnersTable();
        winnersDiv.innerHTML = renderWinners(data.winners);
        break;
      }
    }
  });

  const nextPageBtn = document.querySelector("#next") as HTMLButtonElement;
  nextPageBtn.addEventListener("click", async () => {
    const garageDiv = document.querySelector("#garage") as HTMLDivElement;
    const winnersDiv = document.querySelector("#winners") as HTMLDivElement;
    switch (option.view) {
      case "garage": {
        data.carsPage++;
        await updateGarage();
        garageDiv.innerHTML = renderGarage();
        break;
      }
      case "winners": {
        nextPageBtn.disabled = true;
        data.winnersPage++;
        await updateWinnersTable();
        winnersDiv.innerHTML = renderWinners(data.winners);
        break;
      }
    }
  });
};
