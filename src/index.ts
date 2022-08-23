import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./css/style.css";
import { updateGarage } from "./ts/garageLayout";
import { updateWinnersTable } from "./ts/winnersLayout";
import { renderLayout } from "./ts/layout";
import { listen } from "./ts/listeners";
// import {paginationListner} from './ts/pagination'

renderLayout();
await updateWinnersTable();
await updateGarage();
listen();
// console.log(data);
