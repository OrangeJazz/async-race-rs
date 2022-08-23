export interface Car {
  id?: number;
  name: string;
  color: string;
  isEngineStarted?: boolean;
}

export interface WinnerList {
  id?: number;
  wins?: number;
  time: number;
  car: Car;
}

export interface WinnerCar {
  id?: number;
  car: Car;
  time: number;
}

export interface CarInRace {
  id: number;
  success?: boolean;
  time: number;
}

export interface WinnersOption {
  page: number;
  limit?: 10;
  sort?: string;
  order?: string;
}

export interface Engine {
  velocity: number;
  distance: number;
}

export interface Drive {
  success: boolean;
}

export interface Animation {
  id?: number;
}

export interface WinnerStat {
  id: number;
  wins?: number;
  time: number;
}
