import { StationData } from "@ctypes/types";
import { useStationFetch } from "@hooks/useStationFetch";
import { useRouter } from "next/router";
import { useState } from "react";

function renderStationData(data: StationData) {
    return (
        <table className="w-full divide-y divide-gray-200 shadow-lg rounded-md">
            <thead className="head-lightblue">
            <tr>
                <th className="px-6 py-3 text-left text-xs text-black uppercase font-bold tracking-wider">
                    Property
                </th>
                <th className="px-6 py-3 text-left text-xs text-black uppercase font-bold tracking-wider">
                    Value
                </th>
            </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
            {Object.entries(data).map(([key, value]) => (
                <tr key={key}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {key}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {value}
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    );
}

export default function StationPage() {
    const router = useRouter();
    const { id } = router.query;
    const [startDate, setStartDate] = useState<string>();
    const [endDate, setEndDate] = useState<string>();
    const data = useStationFetch(id as string, startDate, endDate);

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        setStartDate(formData.get("startDate") as string);
        setEndDate(formData.get("endDate") as string);
    }

    return (
        <>
            <div className="bg-white min-h-screen p-6">
                <>{data ? renderStationData(data) : <p>Loading station data...</p>}</>
                <form className="flex flex-col items-center space-y-4 mt-6" onSubmit={handleSubmit}>
                    <div className="flex items-center space-x-2">
                        <label htmlFor="startDate">Start date:</label>
                        <input
                            className="p-2 text-lg border-2 border-gray-300 rounded-md focus:border-blue-300 focus:outline-none"
                            type="date"
                            id="startDate"
                            name="startDate"
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <label htmlFor="endDate">End date:</label>
                        <input
                            className="p-2 text-lg border-2 border-gray-300 rounded-md focus:border-blue-300 focus:outline-none"
                            type="date"
                            id="endDate"
                            name="endDate"
                        />
                    </div>
                    <button
                        className="w-32 p-2 text-lg font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none"
                        type="submit"
                    >
                        Submit
                    </button>
                </form>
            </div>
        </>
    );
}
