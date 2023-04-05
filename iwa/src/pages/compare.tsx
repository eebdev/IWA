import { WeatherStation } from '@ctypes/types';
import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/router';


const Compare = () => {
    const [numberOfStations, setNumberOfStations] = useState(2);
    const [stations, setStations] = useState<WeatherStation[]>([]);
    const [selectedStations, setSelectedStations] = useState<number[]>([]);
    
    const router = useRouter();

  useEffect(() => {
    // Replace with your API endpoint for fetching the list of weather stations
    fetch('/api/weatherstations')
      .then((response) => response.json())
      .then((data: WeatherStation[]) => setStations(data));
  }, []);

  const handleStationSelect = (index: number, stationId: number) => {
    const newSelectedStations = [...selectedStations];
    newSelectedStations[index] = stationId;
    setSelectedStations(newSelectedStations);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
      const idsPath = selectedStations.join('-');
      router.push(`/compare/${idsPath}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="numberOfStations">Number of Weather Stations:</label>
      <input
        id="numberOfStations"
        type="number"
              min="2"
              max="5"
        value={numberOfStations}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setNumberOfStations(parseInt(e.target.value, 10))
        }
      />
      {Array.from({ length: numberOfStations }, (item, index) => (
        <div key={index}>
          <label htmlFor={`station-${index}`}>Station {index + 1}:</label>
          <select
            id={`station-${index}`}
            value={selectedStations[index]}
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              handleStationSelect(index, parseInt(e.target.value))
            }
          >
            <option value="">Select a station</option>
            {stations.map((station) => (
              <option key={station.station_name} value={station.station_name}>
                {station.station_name}
              </option>
            ))}
          </select>
        </div>
      ))}
      <button type="submit">Compare</button>
    </form>
  );
};

export default Compare;
