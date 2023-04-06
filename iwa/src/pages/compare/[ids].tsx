import { StationData } from "@ctypes/types";
import { useStationFetch } from "@hooks/useStationFetch";
import { useRouter } from "next/router";
import { useState } from "react";

function renderStationData(data: StationData[]) {
  return (
    <>
      {data.map((station, index) => (
        <div key={index} className="station-data">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Property
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Value
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Object.entries(station).map(([key, value]) => (
                <tr key={key}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {key}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </>
  );
}



// station/100200?startDate=2004-11-14&endDate=2005-11-14

export default function StationsComparePage() {
  const router = useRouter();
  const { ids } = router.query;
  const [startDate, setStartDate] = useState<string>();
  const [endDate, setEndDate] = useState<string>();
  const data: StationData[] = [];

  const stationIds = ids ? (ids as string).split("-") : [];
  for (const id of stationIds) {
    const stationData = useStationFetch(id, startDate, endDate);
    if (stationData) {
      data.push(stationData);
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setStartDate(formData.get("startDate") as string);
    setEndDate(formData.get("endDate") as string);
  }

  return (
    <>
      <div className="stations-container grid grid-cols-3 gap-4">
        <>{data ? renderStationData(data) : <p>Loading station data...</p>}</>
      </div>
        <form onSubmit={handleSubmit}>
          <label htmlFor="startDate">Start date </label>
          <input type="date" id="startDate" name="startDate" />
          <br></br>
          <label htmlFor="endDate">End date </label>
          <input type="date" id="endDate" name="endDate" />
          <br></br>
          <button type="submit">Submit</button>
        </form>
      
    </>
  );
}
