import { LatLngExpression } from "leaflet";
import dynamic from "next/dynamic";

const DynamicCoordinatesMap = dynamic(
  () => import("@components/CoordinatesMap"),
  { ssr: false }
);

const HomePage = () => {
  const defaultCenter: LatLngExpression = [53.219, 6.566];

  return (
    <div>
      <DynamicCoordinatesMap defaultCenter={defaultCenter} />
    </div>
  );
};

export default HomePage;
