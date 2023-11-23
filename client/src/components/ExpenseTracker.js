import { useState } from "react";
import axios from "axios";
import "../styles/ExpenseTracker.css";

function ExpenseTracker() 
{
    const userToken = JSON.parse(localStorage.getItem('expenseTrackerUserToken'));
    const [formData, setFormData] = useState({
        transactionType: "",
        category: "",
        date: "",
        amount: "",
        description: ""
    });

    const handleChange = (e) => 
    {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => 
    {
        e.preventDefault();

        try 
        {
            const config = 
            {
                headers: 
                {
                    Authorization: `Bearer ${userToken}`,
                },
            };
            const response = await axios.post("http://localhost:3000/api/users/uploadTransactions", formData, config);
            console.log("Transaction added successfully:", response.data);
        }
        catch (error) 
        {
            console.error("Error adding transaction:", error.message);
        }
    };

  return (
    <div className="ExpenseTracker_parent">
        <div className="form_container">
            <h4>Add new transaction</h4>
            <form>
            <legend>Transaction Type</legend>
            <label>
                <input
                type="radio"
                name="transactionType"
                value="Income"
                checked={formData.transactionType === "Income"}
                onChange={handleChange}
                required
                />
                Income
            </label>
            <label>
                <input
                type="radio"
                name="transactionType"
                value="Expense"
                checked={formData.transactionType === "Expense"}
                onChange={handleChange}
                required
                />
                Expense
            </label>

            <label htmlFor="category">Category</label>
            <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
            >
                <option value="NULL">Choose a category</option>
                <option value="Food">Food</option>
                <option value="Transportation">Transportation</option>
                <option value="Shopping">Shopping</option>
                <option value="Bills">Bills</option>
                <option value="Others">Others</option>
            </select>

            <label htmlFor="date">Date</label>
            <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                placeholder="Date"
                required
            />

            <label htmlFor="amount">Amount</label>
            <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="Amount"
                required
            />

            <label htmlFor="description">Description</label>
            <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Description"
                required
            />

            <button type="submit" onClick={handleSubmit}>
                Add Expense
            </button>
            </form>
        </div>
    </div>
  );
}

export default ExpenseTracker;
