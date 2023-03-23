// pages/api/dataReceiver.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { query } from '../../database';

type Data = {
  message: string;
};

async function saveToDatabase(data: any): Promise<void> {
  const { STN, DATE, TIME, TEMP, DEWP, STP, SLP, VISIB, WDSP, PRCP, SNDP, FRSHTT, CLDC, WNDDIR } = data;

  const datetime = `${DATE} ${TIME}`;

  const sql = `
    INSERT INTO station_data (stn, datetime, temp, dewp, stp, slp, visib, wdsp, prcp, sndp, frshtt, cldc, wnddir)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
    
    

  const values = [STN, datetime, TEMP, DEWP, STP, SLP, VISIB, WDSP, PRCP, SNDP, FRSHTT, CLDC, WNDDIR];
  console.log(values);
  await query(sql, values);
}

export default async function dataReceiver(req: NextApiRequest, res: NextApiResponse<Data>): Promise<void> {
  if (req.method === 'POST') {
    try {
      const data = req.body;
      for (const item of data) {
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
