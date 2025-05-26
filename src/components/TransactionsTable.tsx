// pages/TransactionsTable.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import AddTransaction from "./TransactionForm";
import { months, Transaction, years } from "../models/types";

const PAGE_SIZE = 10;

const TransactionsTable: React.FC = () => {
    const now = new Date();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [year, setYear] = useState<string>(new Date().getFullYear().toString());
  const [month, setMonth] = useState<string>(months[now.getMonth()]);
  const [sortBy, setSortBy] = useState<keyof Transaction>("transactionDate");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showModal, setShowModal] = useState(false);

  // Fetch transactions when year/month changes or on mount
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/transaction?year=${year}&month=${month}`
        );
        setTransactions(res.data);
        setCurrentPage(1);
      } catch (err) {
        console.error("Failed to fetch transactions");
        setTransactions([]);
      }
    };
    fetchTransactions();
  }, [year, month]);

  // Apply sorting when transactions, sortBy or sortOrder changes
  useEffect(() => {
    let sorted = [...transactions];
    sorted.sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];
      if (sortBy === "amount") {
        return sortOrder === "asc"
          ? (valA as number) - (valB as number)
          : (valB as number) - (valA as number);
      }
      if (sortBy === "transactionDate") {
            // compare ISO strings
         const dateA = new Date(valA as string).getTime();
        const dateB = new Date(valB as string).getTime();

        if (dateA === dateB) {
            return sortOrder === "asc" ? a.id - b.id : b.id - a.id;
        }

        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      }
      // For category and description, alphabetical
      return sortOrder === "asc"
        ? (valA as string).localeCompare(valB as string)
        : (valB as string).localeCompare(valA as string);
    });
    setFilteredTransactions(sorted);
    setCurrentPage(1);
  }, [transactions, sortBy, sortOrder]);

  const pageCount = Math.ceil(filteredTransactions.length / PAGE_SIZE);
  const pagedTransactions = filteredTransactions.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const toggleSort = (field: keyof Transaction) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const addTransactionToList = (tx: Transaction) => {
    setTransactions((prev) => [tx, ...prev]);
  };

  return (
    <div className="container mt-4">
      <div className="card shadow bg-white p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4>Transactions</h4>
          <button className="btn btn-success" onClick={() => setShowModal(true)}>
            + Add Transaction
          </button>
        </div>

        {/* Filters */}
        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">Year</label>
            <select
              className="form-select"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            >
              {years.map((y) => (
                <option key={y} value={y.toString()}>
                  {y}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label">Month</label>
            <select
              className="form-select"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
            >
              {months.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div style={{ maxHeight: "500px", overflowY: "auto" }}>
          <table className="table table-hover">
            <thead>
              <tr>
                <th
                  style={{ cursor: "pointer" }}
                  onClick={() => toggleSort("transactionDate")}
                >
                  Date{" "}
                  {sortBy === "transactionDate" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
                </th>
                <th
                  style={{ cursor: "pointer" }}
                  onClick={() => toggleSort("category")}
                >
                  Category{" "}
                  {sortBy === "category" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
                </th>
                <th
                  style={{ cursor: "pointer" }}
                  onClick={() => toggleSort("description")}
                >
                  Description{" "}
                  {sortBy === "description"
                    ? sortOrder === "asc"
                      ? "▲"
                      : "▼"
                    : ""}
                </th>
                <th
                  style={{ cursor: "pointer" }}
                  onClick={() => toggleSort("amount")}
                >
                  Amount (₹){" "}
                  {sortBy === "amount" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
                </th>
              </tr>
            </thead>
            <tbody>
              {pagedTransactions.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center text-muted">
                    No transactions found.
                  </td>
                </tr>
              ) : (
                pagedTransactions.map((tx) => (
                  <tr key={tx.id}>
                    <td>{tx.transactionDate}</td>
                    <td>{tx.category}</td>
                    <td>{tx.description}</td>
                    <td>₹{tx.amount.toFixed(2)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pageCount > 1 && (
          <nav>
            <ul className="pagination justify-content-center">
              <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                <button
                  className="page-link"
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                >
                  Previous
                </button>
              </li>
              {Array.from({ length: pageCount }, (_, i) => i + 1).map((page) => (
                <li
                  key={page}
                  className={`page-item ${currentPage === page ? "active" : ""}`}
                >
                  <button className="page-link" onClick={() => setCurrentPage(page)}>
                    {page}
                  </button>
                </li>
              ))}
              <li
                className={`page-item ${currentPage === pageCount ? "disabled" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, pageCount))}
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        )}
      </div>

      {/* Add Transaction Modal */}
      <AddTransaction
        show={showModal}
        onClose={() => setShowModal(false)}
        onTransactionAdded={addTransactionToList}
      />
    </div>
  );
};

export default TransactionsTable;
