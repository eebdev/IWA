import { StationData } from "@ctypes/types";
import { useStationFetch } from "@hooks/useStationFetch";
import { useRouter } from "next/router";

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

export default function StationPage() {
  const router = useRouter();
  const { id } = router.query;
  const data = useStationFetch(id as string);

  return (
    <>{data ? renderStationData(data) : <p>Loading station data...</p>}</>
  );
}
