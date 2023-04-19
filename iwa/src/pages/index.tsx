import Head from 'next/head'
import { useRouter } from 'next/router'
import { WeatherStation } from '@ctypes/types'
import { useEffect, useState } from 'react'
import Link from 'next/link';

export default function Home() {
    const [stations, setStations] = useState<WeatherStation[]>([]);
    const router = useRouter()

    useEffect(() => {
        fetch('/api/weatherstations')
            .then((response) => response.json())
            .then((data: WeatherStation[]) => setStations(data));
    }, []);

    const handleSelect = (event: any) => {
        router.push(`/station/${event.target.value}`)
    }

    return (
        <>
            <Head>
                <title>IWA</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <main className="bg-white min-h-screen p-6">
                <section className="flex flex-col items-center justify-center space-y-4">
                    <div className="text-4xl font-bold text-gray-800">Choose a weatherstation</div>
                    <div className="w-72">
                        <select
                            onChange={handleSelect}
                            name="stations"
                            id="stations"
                            className="w-full p-2 text-lg border-2 border-gray-300 rounded-md focus:border-blue-300 focus:outline-none"
                        >
                            <option value="Choose a weatherstation">Choose a weatherstation</option>
                            {stations.map((station) => (
                                <option key={station.station_name} value={station.station_name}>
                                    {station.station_name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <Link href={'/compare'}>
                        <button className="iwa-button w-48 p-2 text-lg font-semibold rounded-md focus:outline-none">
                            Compare weatherstations
                        </button>
                    </Link>
                </section>
            </main>
        </>
    )
}
