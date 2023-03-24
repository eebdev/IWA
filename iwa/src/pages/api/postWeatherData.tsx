import { NextApiRequest, NextApiResponse } from "next";
import { query } from "../../database";

async function saveToDatabase(data: any) {
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

  const datetime = `${DATE} ${TIME}`;

  await query(`
    INSERT INTO station_data (station_name, datetime, temp, dewp, stp, slp, visib, wdsp, prcp, sndp, frshtt, cldc, wnddir)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [STN, datetime, TEMP, DEWP, STP, SLP, VISIB, WDSP, PRCP, SNDP, FRSHTT, CLDC, WNDDIR]);
}

export default async function dataReceiver(req: NextApiRequest, res: NextApiResponse<Data>): Promise<void> {
  if (req.method === 'POST') {
    try {
      const receivedData = JSON.parse(req.body);
      
      const data = receivedData.WEATHERDATA; // Access the data array

      for (const item of data) {
        // check if any column in the item is None and skip over the entire item if so
        if (Object.values(item).includes('None')) {
          console.log('Skipping item:', item);
          continue;
        }
        await saveToDatabase(item);
      }
      res.status(200).json({ message: 'Data received and saved successfully' });
    } catch (error) {
      console.error('Error saving data:', error);
      res.status(500).json({ message: 'Error saving data to database' });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}
