import {NextApiRequest, NextApiResponse} from "next";
import {
    saveStationData,
    storeMissingStationData,
    updateMissingStationData,
    getStationData,
    getStationDataByDateRange,
    storeLastResponse,
} from "@database/queries";
import {StationData} from "@ctypes/types";

export default async function stationDataHandler(
    req: NextApiRequest,
    res: NextApiResponse<{ message: string; data?: StationData }>
): Promise<void> {
    if (req.method === "POST") {
        await handlePost(req, res);
    } else if (req.method === "GET") {
        await handleGet(req, res);
    } else {
        res.setHeader("Allow", ["POST", "GET"]);
        res.status(405).json({message: "Method not allowed"});
    }
}

async function handlePost(
    req: NextApiRequest,
    res: NextApiResponse<{ message: string; data?: StationData }>
): Promise<void> {
    try {
        // Parse de ontvangen data
        const receivedData = JSON.parse(req.body);

        // Haal de weerdata-array op
        const data = receivedData.WEATHERDATA;

        for (const item of data) {
            await storeLastResponse(item);

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
            .json({message: "Data received and saved successfully"});
    } catch (error) {
        // Log en retourneer een foutmelding en HTTP-status als er een fout optreedt bij het opslaan van de gegevens
        console.error("Error saving data:", error);
        if (error instanceof SyntaxError) {
            // Als de fout een SyntaxError is, stuur dan een 'Bad Request' status en een bericht
            res.status(400).json({message: "Invalid JSON data"});
        } else {
            // Als de fout geen SyntaxError is, stuur dan een 'Internal Server Error' status en een bericht
            res.status(500).json({message: "Error saving data to database"});
        }
    }
}

async function handleGet(
    req: NextApiRequest,
    res: NextApiResponse<{ message: string; data?: StationData }>
): Promise<void> {
    if (req.query.id !== undefined && !isNaN(+req.query.id)) {
        const id = +req.query.id;

        if (
            req.query.start_date !== undefined &&
            req.query.end_date !== undefined
        ) {
            const startDate = new Date(req.query.start_date as string);
            const endDate = new Date(req.query.end_date as string);
            try {
                const data = await getStationDataByDateRange(
                    id,
                    startDate,
                    endDate
                );
                res
                    .status(200)
                    .json({message: "Data fetched successfully", data: data});
            } catch (error) {
                console.log(error)
                res.status(400).json({message: "Something went wrong"});
            }
        } else {
            try {
                const data = await getStationData(id);
                if (data.length === 0) {
                    res.status(404).json({message: "No data found"});
                } else {
                    res
                        .status(200)
                        .json({message: "Data fetched successfully", data: data});
                }
            } catch (error) {
                // Log en retourneer een foutmelding en HTTP-status als er een fout optreedt bij het ophalen van de gegevens
                res
                    .status(500)
                    .json({message: "Error fetching data from database"});
            }
        }
    } else {
        res.status(400).json({message: "Missing or invalid query parameter 'id'"});
    }
}