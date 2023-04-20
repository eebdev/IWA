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
        <div className="bg-white min-h-screen p-6">
            <form
                className="flex flex-col items-center justify-center space-y-4 gap-4"
                onSubmit={handleSubmit}
            >
                <div className="flex items-center space-x-2">
                    <label htmlFor="numberOfStations">Number of Weather Stations:</label>
                    <input
                        id="numberOfStations"
                        className="w-20 p-2 text-lg border-2 border-gray-300 rounded-md focus:border-blue-300 focus:outline-none"
                        type="number"
                        min="2"
                        max="5"
                        value={numberOfStations}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            let num = parseInt(e.target.value, 10);
                            if (num < 2) num = 2;
                            if (num > 5) num = 5;
                            setNumberOfStations(num);
                        }}
                    />
                </div>
                <div className="flex flex-wrap items-center justify-center space-x-4 space-e-4">
                    {Array.from({ length: numberOfStations }, (item, index) => (
                        <div key={index} className="flex items-center space-x-2">
                            <label htmlFor={`station-${index}`}>Station {index + 1}:</label>
                            <select
                                id={`station-${index}`}
                                className="w-64 p-2 text-lg border-2 border-gray-300 rounded-md focus:border-blue-300 focus:outline-none"
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
                </div>
                <button
                    className="iwa-button w-32 p-2 text-lg font-semibold rounded-md focus:outline-none"
                    type="submit"
                >
                    Compare
                </button>
            </form>
        </div>
    );
};

export default Compare;
