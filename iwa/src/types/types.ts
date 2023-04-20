export type WeatherData = {
    STN: number;
    DATE: string;
    TIME: Date;
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
    station_name: number;
    datetime: Date;
    temp: number;
    dewp: number;
    stp: number;
    slp: number;
    visib: number;
    wdsp: number;
    prcp: number;
    sndp: number;
    frshtt: string;
    cldc: number;
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
