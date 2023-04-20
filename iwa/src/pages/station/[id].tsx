import { StationData } from "@ctypes/types";
import { useStationFetch } from "@hooks/useStationFetch";
import { useRouter } from "next/router";
import { useState } from "react";
import { Chart, LineController, CategoryScale, LinearScale, PointElement, LineElement, Tooltip } from 'chart.js';

Chart.register(LineController, CategoryScale, LinearScale, PointElement, LineElement, Tooltip);
 

const snapLinePlugin = {
    id: 'snapLine',
    afterDraw: (chart: Chart) => {
      if (chart.tooltip.getActiveElements().length === 0) {
        return;
      }
      const activePoint = chart.tooltip.getActiveElements()[0];
      const ctx = chart.ctx;
      const x = activePoint.element.x;
      const yTop = chart.scales.y.top;
      const yBottom = chart.scales.y.bottom;
  
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(x, yTop);
      ctx.lineTo(x, yBottom);
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.stroke();
      ctx.restore();
    },
  };


function renderStationData(data: StationData) {
    const canvas = document.getElementById('chart') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');

    
    

    if (ctx) {
        const existingChart = Chart.getChart(ctx);
        if (existingChart) {
            existingChart.destroy();
        }
        new Chart(ctx, {
            type: 'line',
            data: {
              labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
              datasets: [
                {
                  label: 'Mock Data',
                  data: [12, 19, 3, 5, 2, 3, 9],
                  borderColor: 'rgba(255, 99, 132, 1)',
                  backgroundColor: 'rgba(255, 99, 132, 0.2)',
                  borderWidth: 1,
                },
              ],
            },
            options: {
              aspectRatio: 2,
              animation: {
                duration: 2000,
                easing: 'easeOutQuint',
                delay: 0,
              },
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
              plugins: {
                tooltip: {
                  callbacks: {
                    label: (context: any) => {
                      return `${context.dataset.label}: ${context.parsed.y}`;
                    },
                  },
                },
              },
            },
            plugins: [snapLinePlugin],

        }); 
    } else {
        console.error('Cannot create chart, canvas context is null');
    }
    
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
                <div className="chart-container flex flex-wrap justify-center" style={{ 'width': '100vw', 'height': 400, 'marginTop': 100 }}>
                    <canvas id="chart"></canvas>
                </div>
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
