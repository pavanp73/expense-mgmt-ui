// pages/AddTransaction.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";

interface Props {
  show: boolean;
  onClose: () => void;
  onTransactionAdded: (tx: any) => void;
}

interface Category {
  id: number;
  name: string;
}

const AddTransaction: React.FC<Props> = ({ show, onClose, onTransactionAdded }) => {
  const [formData, setFormData] = useState({
    category: "",
    description: "",
    amount: "",
    transactionDate: "",
  });

  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:8080/category");
        //console.log("Categories response:", res.data);
        setCategories(res.data);
      } catch (err) {
        console.error("Failed to fetch categories");
      }
    };

    if (show) fetchCategories();
  }, [show]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8080/transaction", formData);
      //console.log("Transaction added:", response.data);
      onTransactionAdded(res.data);
      onClose();
    } catch (error) {
      alert("Failed to add transaction");
    }
  };

  return (
    <div className={`modal ${show ? "d-block" : "d-none"}`} style={{ backgroundColor: "#00000088" }}>
      <div className="modal-dialog">
        <div className="modal-content shadow">
          <div className="modal-header">
            <h5 className="modal-title">Add Transaction</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-2">
                <label className="form-label">Date</label>
                <input type="date" className="form-control" name="transactionDate" required onChange={handleChange} />
              </div>
              <div className="mb-2">
                <label className="form-label">Category</label>
                <select name="category" className="form-select" required onChange={handleChange}>
                  <option value="">Select</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-2">
                <label className="form-label">Description</label>
                <input type="text" name="description" className="form-control" required onChange={handleChange} />
              </div>
              <div className="mb-2">
                <label className="form-label">Amount</label>
                <input type="number" name="amount" className="form-control" required onChange={handleChange} />
              </div>
            </div>
            <div className="modal-footer">
              <button type="submit" className="btn btn-primary">Add</button>
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddTransaction;
