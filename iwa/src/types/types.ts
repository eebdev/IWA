export type WeatherData = {
  STN: string;
  DATE: string;
  TIME: string;
  TEMP: number;
  DEWP: number;
  STP: number;
  SLP: number;
  VISIB: number;
  WDSP: number;
  PRCP: number;
  SNDP: number;
  FRSHTT: string;
  CLDC: number;
  WNDDIR: number;
};

export type StationData = {
  cldc: string;
  datetime: string;
  dewp: string;
  frshtt: string;
  prcp: string;
  slp: string;
  sndp: string;
  station_data_id: number;
  station_name: string;
  stp: string;
  temp: string;
  visib: string;
  wdsp: string;
  wnddir: number;
};

export type StationDataPoints = {
  data: StationData[];
};

export type WeatherStation = {
  station_name: number;
};

export type Coordinate = {
  latitude: number;
  longitude: number;
  name: string;
};

export type Coordinates = Coordinate[];
