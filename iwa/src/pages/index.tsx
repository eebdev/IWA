import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import { ReactEventHandler } from 'react'
import { useRouter } from 'next/router'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const router = useRouter()

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

        <section className='main-section'>
        <div>
          <h1>Choose a weatherstation</h1>
        </div>
          <select onChange={handleSelect} name="stations" className="stations">
            <option value="placeholder">Choose an option</option>
            <option value="100150">100150</option>
            <option value="100200">100200</option>
            <option value="100260">100260</option>
          </select>
        </section>
      </main>
    </>
  )
}