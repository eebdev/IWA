import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import { ReactEventHandler, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link';
import { WeatherStation } from '@ctypes/types'

const inter = Inter({ subsets: ['latin'] })


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
      <main>

        <section className='flex flex-col items-center justify-center'>
        <div>
          <h1>Choose a weatherstation</h1>
          </div>
          <select onChange={handleSelect} name="stations" id="stations">
            <option value="Choose a weatherstation">Choose a weatherstation</option>
            {stations.map((station) => (
              <option key={station.station_name} value={station.station_name}> {station.station_name} </option>
            ))}
          </select>
          
          <Link className='bg-gray-200 rounded-lg p-2 m-2' href={'/compare'}>
              <button>Compare weatherstations</button>
          </Link>
        </section>
      </main>
    </>
  )
}