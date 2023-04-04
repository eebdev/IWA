import { StationData } from "@ctypes/types";
import { useStationFetch } from "@hooks/useStationFetch";
import { useRouter } from "next/router";
import { useState } from "react";

function renderStationData(data: StationData) {
  return (
    <table>
      <thead>
        <tr>
          <th>Property</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(data).map(([key, value]) => (
          <tr key={key}>
            <td>{key}</td>
            <td>{value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// station/100200?startDate=2004-11-14&endDate=2005-11-14

export default function StationPage() {
  const router = useRouter();
  const { id } = router.query;
  const [startDate, setStartDate] = useState<string>();
  const [endDate, setEndDate] = useState<string>();
  const data = useStationFetch(id as string, startDate, endDate);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setStartDate(formData.get("startDate") as string);
    setEndDate(formData.get("endDate") as string);
  }

  return (
    <>
      <>{data ? renderStationData(data) : <p>Loading station data...</p>}</>
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
