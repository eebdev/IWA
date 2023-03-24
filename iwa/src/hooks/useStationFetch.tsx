import { useState, useEffect } from "react";
import { StationData } from "@ctypes/types";

export function useStationFetch(
  station_name: string
): StationData | undefined {
  const [data, setData] = useState<StationData>();

  useEffect(() => {
    if (!station_name) return undefined;

    const fetchData = async () => {
      const res = await fetch(`/api/weatherdata?id=${station_name}`);
      const data = await res.json();
      setData(data.data);
    };

    fetchData();
  }, [station_name]);

  return data;
}
