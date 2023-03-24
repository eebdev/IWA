import { useStationFetch } from "@hooks/useStationFetch";
import { useRouter } from "next/router";

export default function StationPage() {
  const router = useRouter();
  const { id } = router.query;
  const data = useStationFetch(id as string);

  return <>{data?.frshtt}</>;
}
