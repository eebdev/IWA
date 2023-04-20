import { WeatherStation } from '@ctypes/types';
import { getWeatherStations } from '@database/queries';
import type { NextApiRequest, NextApiResponse } from 'next';




export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const stations: WeatherStation[] = await getWeatherStations();
        res.status(200).json(stations);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error fetching weather stations' });
  }
};
