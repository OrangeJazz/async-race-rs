import { data } from "./data";
import { renderGarage } from "./garageLayout";
import { renderWinners } from "./winnersLayout";

export const renderLayout = async () => {
  const html = `
  <div class="container">
    <div class="menu">
      <div class="btn btn-dark garage-menu-button" id="garage-menu">To garage</div>
      <div class="btn btn-dark winners-menu-button" id="winners-menu">To winners</div>
    </div>
    <div id="garage-view">
      <div>
        <form class="form" id="create">
          <input type="text" id="create-name" name="name" class="input">
          <input type="color" id="create-color" name="color" class="color" value="#ffffff">
          <button class="btn btn-secondary" type="submit">Create</button>
        </form>
        <form class="form" id="update">
          <input type="text" id="update-name" name="name" class="input" disabled>
          <input type="color" id="update-color" name="color" class="color" value="#ffffff" disabled>
          <button class="btn btn-secondary" id="update-submit" type="submit" disabled>Update</button>
        </form>
      </div>
      <div class="race-controls">
        <button class="btn btn-secondary race-btn primary" id="race">Race</button>
        <button class="btn btn-secondary reset-btn primary" id="reset" disabled>Reset</button>
        <button class="btn btn-secondary generator-button primary" id="generator">Generate cars</button>
      </div>
      <div id="garage">
        ${renderGarage()}
      </div>
      <div>
        <p class="message" id="message"></p>
      </div>
    </div>
    <div id="winners">
      ${renderWinners(data.winners)}
    </div>
    <div class="pagination btn-group">
      <button class="btn btn-dark prev-button" disabled id="prev">Prev</button>
      <button class="btn btn-dark next-button" disabled id="next">Next</button>
    </div>
  </div>
  `;
  const root = document.createElement("div");
  root.innerHTML = html;
  document.body.appendChild(root);
};
