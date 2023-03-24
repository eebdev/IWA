// Importeer de benodigde modules en database query-functie
import { NextApiRequest, NextApiResponse } from "next";
import {
  saveStationData,
  storeMissingStationData,
  updateMissingStationData,
  getStationData,
} from "@database/weatherData";
import { StationData } from "@ctypes/types";

/**
 * De dataReceiver functie is een async handler voor NextApiRequest en NextApiResponse.
 * Het verwerkt inkomende POST-verzoeken met weerdata, slaat de gegevens op in de database en retourneert een passende HTTP-status.
 * @param {NextApiRequest} req - Het NextApiRequest object.
 * @param {NextApiResponse} res - Het NextApiResponse object.
 * @returns {Promise<void>} - Een lege promise.
 */
export default async function dataReceiver(
  req: NextApiRequest,
  res: NextApiResponse<{ message: string; data?: StationData }>
): Promise<void> {
  // Controleer of het verzoek een POST-methode is
  if (req.method === "POST") {
    try {
      // Parse de ontvangen data
      const receivedData = JSON.parse(req.body);

      // Haal de weerdata-array op
      const data = receivedData.WEATHERDATA;

      // Verwerk elk item in de weerdata-array
      for (const item of data) {
        // Controleer of er een 'None' waarde in het item zit
        let hasMissingValue = false;
        let missingColumnName = "";

        for (const key in item) {
          if (item[key] === "None") {
            hasMissingValue = true;
            missingColumnName = key;
            item[key] = null;
            break;
          }
        }

        if (hasMissingValue) {
          // Sla het item op in de missing_data tabel
          // console.log("Missing value found:", item.STN, missingColumnName);
          await storeMissingStationData(item, missingColumnName);
        } else {
          // Sla het item op in de database
          await saveStationData(item);

          // Controleer of er missende data is die kan worden bijgewerkt
          await updateMissingStationData(item.STN);
        }
      }
      // Stuur een succesvolle HTTP-status en bericht terug
      res
        .status(200)
        .json({ message: "Data received and saved successfully" });
    } catch (error) {
      // Log en retourneer een foutmelding en HTTP-status als er een fout optreedt bij het opslaan van de gegevens
      console.error("Error saving data:", error);
      if (error instanceof SyntaxError) {
        // Als de fout een SyntaxError is, stuur dan een 'Bad Request' status en een bericht
        res.status(400).json({ message: "Invalid JSON data" });
      } else {
        // Als de fout geen SyntaxError is, stuur dan een 'Internal Server Error' status en een bericht
        res.status(500).json({ message: "Error saving data to database" });
      }
    }
  } else if (req.method === "GET") {
    // Als de gebruiker geen ID opgeeft, stuur dan een 'Bad Request' status en een bericht
    if (req.query.id !== undefined) {
      try {
        const data = await getStationData(req.query.id as string);
        res
          .status(200)
          .json({ message: "Data fetched successfully", data: data });
      } catch (error) {
        // Log en retourneer een foutmelding en HTTP-status als er een fout optreedt bij het ophalen van de gegevens
        res.status(500).json({ message: "Error fetching data from database" });
      }
    } else {
      res.status(400).json({ message: "Missing query parameter 'id'" });
    }
  } else {
    // Als de verzoekmethode geen POST is, stuur dan een 'Method Not Allowed' status en een bericht
    res.setHeader("Allow", ["POST", "GET"]);
    res.status(405).json({ message: "Method not allowed" });
  }
}