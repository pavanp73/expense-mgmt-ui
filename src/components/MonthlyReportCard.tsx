import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    Chart,
    ChartOptions,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { ChartData } from "../models/types";
import COLORS from "../utils/colors";

ChartJS.register(ArcElement, Tooltip, Legend);

const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

const MonthlyReportCard: React.FC = () => {
    const now = new Date();
    const [selectedMonth, setSelectedMonth] = useState<string>(months[now.getMonth()]);
    const [selectedYear, setSelectedYear] = useState<number>(now.getFullYear());
    const [data, setData] = useState<ChartData>();
    const chartRef = useRef<Chart<"doughnut">>(null);


    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const res = await axios.get<ChartData>(
                    `http://localhost:8080/chart?month=${selectedMonth}&year=${selectedYear}`
                );
                setData(res.data);
            } catch (err) {
                console.error("Failed to fetch summary", err);
            }
        };
        fetchSummary();
    }, [selectedMonth, selectedYear]);

    const categoryLabels = data ? data.categoryWiseData.map(obj => obj.category) : []
    const categoryAmount = data ? data.categoryWiseData.map(obj => obj.totalAmount) : []

    const chartData = {
        labels: categoryLabels,
        datasets: [
            {
                data: categoryAmount,
                backgroundColor: COLORS,
                borderWidth: 1,
            },
        ],
    };

    const chartOptions: ChartOptions<"doughnut"> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: "right"
            },
            tooltip: {
                enabled: true, // Hides tooltip labels
            },
        },
    };

    return (
        <div className="container py-4">
            <h2 className="mb-4">Monthly Report</h2>

            <div className="row mb-3">
                <div className="col-md-6">
                    <label className="form-label">Select Month</label>
                    <select
                        className="form-select"
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                    >
                        {months.map((month) => (
                            <option key={month}>{month}</option>
                        ))}
                    </select>
                </div>
                <div className="col-md-6">
                    <label className="form-label">Select Year</label>
                    <select
                        className="form-select"
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                    >
                        {years.map((year) => (
                            <option key={year}>{year}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="row g-4">
                <div className="card shadow bg-white p-4">
                    <h5 className="mb-3">Expenses Doughnut Chart</h5>
                    <div className="d-flex justify-content-center" style={{ height: "300px" }}>
                        <Doughnut
                            ref={chartRef}
                            data={chartData}
                            options={chartOptions}
                        />
                    </div>
                    <p className="mt-3 text-muted texted-center">
                        Click on a segment to view transactions.
                    </p>
                </div>
            </div>

        </div>
    );
};

export default MonthlyReportCard;
