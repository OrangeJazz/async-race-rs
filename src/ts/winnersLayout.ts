import { data, option } from "./data";
import { getAllWinners } from "./api";
import { WinnerList } from "./types";

export const renderWinners = (winners: WinnerList[]) => `
<h4>Winners (${data.winnersCount})</h4>
<h6>Page #${data.winnersPage}</h3>
<table class="table" cellspacing="0" border="0" cellpadding="0">
  <thead>
    <th>Number</th>
    <th>Car name</th>
    <th class="table-button table-wins ${
      option.sortBy === "wins" ? option.sortOrder : ""
    }" id="sort-by-wins">Wins</th>
    <th class="table-button table-time ${
      option.sortBy === "time" ? option.sortOrder : ""
    }" id="sort-by-time">Best time (seconds)</th>
  </thead>
  <tbody>
    ${winners
      .map(
        (winner, index) => `
    <tr>
      <td>${index + 1}</td>
      <td>${winner.car.name}</td>
      <td>${winner.wins}</td>
      <td>${winner.time}</td>
    </tr>`
      )
      .join("")}
  </tbody>

</table>
`;

export const updateWinnersTable = async () => {
  const nextPage = document.querySelector("#next") as HTMLButtonElement;
  const prevPage = document.querySelector("#prev") as HTMLButtonElement;
  const { items, count } = await getAllWinners(data.winnersPage);
  data.winners = items;
  data.winnersCount = Number(count);
  if (data.winnersPage * 10 < data.winnersCount) {
    nextPage.disabled = false;
  } else {
    nextPage.disabled = true;
  }

  if (data.winnersPage > 1) {
    prevPage.disabled = false;
  } else {
    prevPage.disabled = true;
  }
};

export const setSortOrder = async (sortBy: string) => {
  const winnersDiv = document.querySelector("#winners") as HTMLDivElement;
  option.sortOrder = option.sortOrder === "asc" ? "desc" : "asc";
  option.sortBy = sortBy;
  await updateWinnersTable();
  winnersDiv.innerHTML = renderWinners(data.winners);
};
