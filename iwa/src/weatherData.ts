import { useState } from 'react'
import { useRouter } from 'next/router'
import { useEffect } from 'react';

export default function Station() {
    const router = useRouter();
    const { id } = router.query;
    const [data, setData] = useState(null);

    useEffect(() => {
        if (id) {
            fetch(`http://localhost:3000/api/getStationData?id=${id}`) // Fetch data from the API
                .then((res) => res.json()) // Parse the response as JSON
                .then((data) => {
                    setData(data.data[0]);
                })
        }
    }, [id]);

}
