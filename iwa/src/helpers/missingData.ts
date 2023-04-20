import {WeatherData} from "@ctypes/types";

/**
 * Berekent de gemiddelde waarde van de meegegeven kolom.
 * @param {WeatherData[]} surroundingData - Een array met de vorige en volgende 5 data punten.
 * @param {string} columnName - De naam van de kolom waar de data mist.
 * @returns {number | string | null} - De gemiddelde waarde van de meegegeven kolom.
 **/
export function calculateMissingValue(
    surroundingData: WeatherData[],
    columnName: keyof WeatherData
): number | string | null {
    const lowercaseColumnName = columnName.toLowerCase() as keyof WeatherData;
    const values = surroundingData.map((data) => data[lowercaseColumnName]);

    // Als er een 'None' waarde in de array zit, return dan null
    if (values.some((value) => value === "None")) {
        return null;
    }

    let numericValues: number[];
    let sum = 0;

    // Bekijk welke kolom het is en bereken de gemiddelde waarde
    switch (columnName) {
        case "TEMP":
        case "DEWP":
        case "STP":
        case "SLP":
        case "VISIB":
        case "WDSP":
        case "PRCP":
        case "SNDP":
        case "CLDC":
            // Voor de numerieke kolommen, return de gemiddelde waarde
            numericValues = values.map((value) => parseFloat(value as string));
            sum = numericValues.reduce((acc, value) => acc + value, 0);
            return sum / numericValues.length;
        case "WNDDIR":
            // Voor de WNDDIR kolom, return de gemiddelde waarde als volledig nummer
            numericValues = values.map((value) => parseFloat(value as string));
            sum = numericValues.reduce((acc, value) => acc + value, 0);
            return Math.round(sum / numericValues.length);


        case "FRSHTT":
            // Voor de FRSHTT kolom, return de meest voorkomende waarde. Dit is omdat de FRSHTT een binary string is.
            const frequency: Record<string, number> = values.reduce(
                (acc: Record<string, number>, value) => {
                    acc[value as string] = (acc[value as string] || 0) + 1;
                    return acc;
                },
                {}
            );
            return Object.entries(frequency).sort((a, b) => b[1] - a[1])[0][0];

        default:
            // Als de kolom niet bestaat, return dan null
            console.error(`Column ${columnName} does not exist`);
            return null;
    }
}
