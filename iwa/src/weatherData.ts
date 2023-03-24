import { query } from "./database";
import { WeatherData } from "./types";
import { calculateMissingValue } from "@/missingData";

/**
 * Slaat de weerdata op in de database.
 * @param {WeatherData} data - Het dataobject met weerinformatie.
 */
export async function saveToDatabase(data: WeatherData) {
  // Destructureer de kolommen uit het dataobject
  const {
    STN,
    DATE,
    TIME,
    TEMP,
    DEWP,
    STP,
    SLP,
    VISIB,
    WDSP,
    PRCP,
    SNDP,
    FRSHTT,
    CLDC,
    WNDDIR,
  } = data;

  // Combineer de datum- en tijdvelden tot een enkele datetime-waarde
  const datetime = `${DATE} ${TIME}`;

  // Voer een query uit om de weerdata in de database op te slaan
  await query(
    `
    INSERT INTO station_data (station_name, datetime, temp, dewp, stp, slp, visib, wdsp, prcp, sndp, frshtt, cldc, wnddir)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `,
    [
      STN,
      datetime,
      TEMP,
      DEWP,
      STP,
      SLP,
      VISIB,
      WDSP,
      PRCP,
      SNDP,
      FRSHTT,
      CLDC,
      WNDDIR,
    ]
  );
}

/**
 * Ontvang de vorige en volgende 5 data punten van de meegegeven station_name en datetime.
 * @param {string} station_name - De naam van de weerstation.
 * @param {string} datetime -  De datum en tijd van de weerdata.
 * @returns {Promise<WeatherData[]>} - Een array met de vorige en volgende 5 data punten.
 */
async function getSurroundingData(
  station_name: string,
  datetime: string
): Promise<WeatherData[]> {
  const data = await query(
    `
    (SELECT * FROM station_data
    WHERE station_name = ? AND datetime < ?
    ORDER BY datetime DESC LIMIT 5)
    UNION ALL
    (SELECT * FROM station_data
    WHERE station_name = ? AND datetime > ?
    ORDER BY datetime ASC LIMIT 5)
  `,
    [station_name, datetime, station_name, datetime]
  );

  // console.log(data);
  return data;
}

/**
 * Slaat de missende weerdata op in de database om deze later te kunnen gebruiken voor interpolatie.
 * @param {WeatherData} data - Het dataobject met weerinformatie.
 * @param {string} column_name - De naam van de kolom waar de data mist.
 */
export async function storeMissingData(data: WeatherData, column_name: string) {
  // Destructureer de kolommen uit het dataobject
  const {
    STN,
    DATE,
    TIME,
    TEMP,
    DEWP,
    STP,
    SLP,
    VISIB,
    WDSP,
    PRCP,
    SNDP,
    FRSHTT,
    CLDC,
    WNDDIR,
  } = data;

  // Combineer de datum- en tijdvelden tot een enkele datetime-waarde
  const datetime = `${DATE} ${TIME}`;

  // Voer een query uit om de weerdata in de database op te slaan
  await query(
    `
    INSERT INTO missing_data (station_name, datetime, temp, dewp, stp, slp, visib, wdsp, prcp, sndp, frshtt, cldc, wnddir, column_name)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `,
    [
      STN,
      datetime,
      TEMP,
      DEWP,
      STP,
      SLP,
      VISIB,
      WDSP,
      PRCP,
      SNDP,
      FRSHTT,
      CLDC,
      WNDDIR,
      column_name,
    ]
  );
}

/**
 * Update de missende data in de database.
 * @param {string} station_name - De naam van het weerstation.
 */
export async function updateMissingDataIfNeeded(station_name: string) {
  // Haal alle missende data op voor het meegegeven weerstation
  const missingDataList = await query(
    "SELECT * FROM missing_data WHERE station_name = ?",
    [station_name]
  );

  for (const missingData of missingDataList) {
    // Haal de vorige en volgende 5 data punten op
    const surroundingData = await getSurroundingData(
      missingData.station_name,
      missingData.datetime
    );

    if (surroundingData.length >= 10) {
      // Berekent de gemiddelde waarde van de meegegeven kolom
      const calculatedValue = calculateMissingValue(
        surroundingData,
        missingData.column_name
      );

      if (calculatedValue !== null) {
        // Update de missende data in de station_data tabel
        await query(
          `
          UPDATE station_data
          SET ${missingData.column_name} = ?
          WHERE station_name =           ? AND datetime = ?
          `,
          [calculatedValue, missingData.station_name, missingData.datetime]
        );

        // Verwijder de missende data uit de missing_data tabel
        await query(
          `
            DELETE FROM missing_data
            WHERE station_name = ? AND datetime = ? AND column_name = ?
          `,
          [
            missingData.station_name,
            missingData.datetime,
            missingData.column_name,
          ]
        );
      }
    }
  }
}

export async function getDataFromDatabase(
    station_name: string
    ): Promise<WeatherData> {
    const data = await query(
        `
        SELECT * FROM station_data
        WHERE station_name = ? LIMIT 1
    `,
        [station_name]
    );
    return data[0];
    }