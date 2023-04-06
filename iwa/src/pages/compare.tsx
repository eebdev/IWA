import { WeatherStation } from '@ctypes/types';
import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/router';


const Compare = () => {
    const [numberOfStations, setNumberOfStations] = useState(2);
    const [stations, setStations] = useState<WeatherStation[]>([]);
    const [selectedStations, setSelectedStations] = useState<number[]>([]);

    const router = useRouter();

  useEffect(() => {
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
    <form className='flex flex-row items-center justify-between bg-gray-200 rounded-lg p-2 m-2' onSubmit={handleSubmit}>
        <div>
      <label htmlFor="numberOfStations">Number of Weather Stations:</label>
        <input
        id="numberOfStations"
                className='flex flex-row items-end justify-end bg-gray-200 rounded-lg p-2 m-2'
        type="number"
              min="2"
              max="5"
        value={numberOfStations}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
            let num = parseInt(e.target.value, 10);
            if (num < 2) num = 2;
            if (num > 5) num = 5;
            setNumberOfStations(num)
        }
        }
      />
        </div>
        <div className="flex flex-row items-center justify-between bg-gray-200 rounded-lg p-2 m-2">
      {Array.from({ length: numberOfStations }, (item, index) => (
        <div key={index}>
          <label htmlFor={`station-${index}`}>Station {index + 1}:</label>
          <select
            id={`station-${index}`}
            className='flex flex-row items-end justify-end bg-gray-200 rounded-lg p-2 m-2'
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
      <button className='flex flex-row items-center justify-center bg-gray-200 rounded-lg p-2 m-2' type="submit">Compare</button>
        </div>
    </form>
  );
};

export default Compare;
