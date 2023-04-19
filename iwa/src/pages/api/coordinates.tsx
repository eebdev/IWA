import {getAllLastResponse, getCoordinates} from "@database/queries";
import type { NextApiRequest, NextApiResponse } from 'next';


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const allLastResponse = await getAllLastResponse();
    const now = new Date();
    let coordinates = [];
    for (const item of allLastResponse) {
        const lastResponse = new Date(item.last_response)
        if (now.getTime() - 2*60*60*1000 - lastResponse.getTime() > 3 * 60 * 1000) {
            const stationCoordinates = await getCoordinates(item.station_name);
            coordinates.push(stationCoordinates);
        }
    }
    res.status(200).json(coordinates);
}