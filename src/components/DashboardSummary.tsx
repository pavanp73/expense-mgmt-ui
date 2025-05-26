import React, { useEffect, useState } from "react";
import axios from "axios";
import { Transaction } from "../models/types";
import MONTHS from "../utils/months";

const Dashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categoryTotals, setCategoryTotals] = useState<{ [key: string]: number }>({});
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("");

  useEffect(() => {
    const now = new Date();
    setSelectedMonth(String(now.getMonth() + 1).padStart(2, "0"));
    setSelectedYear(String(now.getFullYear()));
  }, []);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await axios.get("http://localhost:8080/transaction");
        const filtered = res.data.filter((tx: Transaction) => {
          const [year, month] = tx.transactionDate.split("-");
          return year === selectedYear && month === selectedMonth;
        });

        setTransactions(filtered);

        const totals: { [key: string]: number } = {};
        let sum = 0;
        filtered.forEach((tx: { category: string | number; amount: number; }) => {
          totals[tx.category] = (totals[tx.category] || 0) + tx.amount;
          sum += tx.amount;
        });

        setCategoryTotals(totals);
        setTotalAmount(sum);
      } catch (err) {
        console.error("Failed to fetch transactions", err);
      }
    };

    if (selectedMonth && selectedYear) {
      fetchTransactions();
    }
  }, [selectedMonth, selectedYear]);

  const recentTransactions = [...transactions]
  .sort((a, b) => {
    const dateA = new Date(a.transactionDate).getTime();
    const dateB = new Date(b.transactionDate).getTime();

    if (dateA === dateB) {
      // Secondary sort by id in descending order
      return b.id - a.id;
    }

    return dateB - dateA; // Primary sort: newest date first
  })
  .slice(0, 5);


  const years = Array.from({ length: 10 }, (_, i) => String(new Date().getFullYear() - i));

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>
          Summary - {MONTHS.find((m) => m.value === selectedMonth)?.label} {selectedYear}
        </h4>
        <div className="d-flex gap-2">
          <select
            className="form-select"
            style={{ width: "120px" }}
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            {MONTHS.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
          <select
            className="form-select"
            style={{ width: "100px" }}
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="row">
        {/* Category Totals */}
        <div className="col-md-6 mb-3">
          <div className="card h-100 bg-white shadow rounded p-3">
            <div className="card-body">
                <h5>Total Expenses</h5>
                <h3 className="text-primary mb-3">₹{totalAmount.toFixed(2)}</h3>
                <h6 className="mb-2">Category Breakdown</h6>
                    {Object.keys(categoryTotals).length === 0 ? (
                    <p className="text-muted">No data available</p>
                    ) : (
                    <ul className="list-group list-group-flush">
                    {Object.entries(categoryTotals)
                    .sort((o1, o2) => o2[1] - o1[1])
                    .map(([cat, amt]) => (
                    <li
                        key={cat}
                        className="list-group-item d-flex justify-content-between"
                    >
                    <span>{cat}</span>
                    <span>₹{amt.toFixed(2)}</span>
          </li>
        ))}
      </ul>
    )}
  </div>
</div>
        </div>

        {/* Recent Transactions */}
        <div className="col-md-6 mb-3">
          <div className="card h-100 bg-white shadow rounded p-3">
            <div className="card-body">
              <h5 className="card-title">Recent Transactions</h5>
              {recentTransactions.length === 0 ? (
                <p className="text-muted">No recent transactions</p>
              ) : (
                <ul className="list-group list-group-flush">
                  {recentTransactions.map((tx, i) => (
                    <li
                      key={i}
                      className="list-group-item d-flex justify-content-between align-items-start"
                    >
                      <div>
                        <strong>{tx.category}</strong> - {tx.description}
                        <br />
                        <small className="text-muted">{tx.transactionDate}</small>
                      </div>
                      <span className="fw-bold">₹{tx.amount.toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
