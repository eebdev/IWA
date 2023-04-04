import { useState, useEffect } from "react";
import { StationData } from "@ctypes/types";

export function useStationFetch(
  station_name: string,
  start_date?: string,
  end_date?: string
): StationData | undefined {
  const [data, setData] = useState<StationData>();
  let url = "";

  if (start_date && end_date) {
    url = `/api/weatherdata?id=${station_name}&start_date=${start_date}&end_date=${end_date}`;
  } else {
    url = `/api/weatherdata?id=${station_name}`;
  }
  
  useEffect(() => {
    if (!station_name) return undefined;

    const fetchData = async () => {
      const res = await fetch(url);
      const data = await res.json();
      setData(data.data);
    };

    fetchData();
  }, [station_name]);

  return data;
}
