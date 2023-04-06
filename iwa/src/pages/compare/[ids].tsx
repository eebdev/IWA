import { StationData } from "@ctypes/types";
import { useStationFetch } from "@hooks/useStationFetch";
import { useRouter } from "next/router";
import { useState } from "react";

function renderStationData(data: StationData[]) {
  return (
      <div className="flex flex-wrap justify-center">
        {data.map((station, index) => (
            <div key={index} className="w-full sm:w-1/2 lg:w-1/3 p-4">
              <table className="min-w-full divide-y divide-gray-200 shadow-lg rounded-md">
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
      </div>
  );
}

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
        <div className="bg-white min-h-screen p-6">
          <div className="stations-container">
            <>{data ? renderStationData(data) : <p>Loading station data...</p>}</>
          </div>
          <form className="flex flex-col items-center space-y-4" onSubmit={handleSubmit}>
            <div className="flex items-center space-x-2">
              <label htmlFor="startDate">Start date:</label>
              <input
                  className="p-2 text-lg border-2 border-gray-300 rounded-md focus:border-blue-300 focus:outline-none"
                  type="date"
                  id="startDate"
                  name="startDate"
              />
            </div>
            <div className="flex items-center space-x-2">
              <label htmlFor="endDate">End date:</label>
              <input
                  className="p-2 text-lg border-2 border-gray-300 rounded-md focus:border-blue-300 focus:outline-none"
                  type="date"
                  id="endDate"
                  name="endDate"
              />
            </div>
            <button
                className="iwa-button w-32 p-2 text-lg font-semibold rounded-md focus:outline-none"
                type="submit"
            >
              Submit
            </button>
          </form>
        </div>
      </>
  );
}
