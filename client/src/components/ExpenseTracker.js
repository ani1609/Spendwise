import { useState, useEffect } from "react";
import "../styles/ExpenseTracker.css";


function ExpenseTracker() 
{

    return (
        <div className="ExpenseTracker_parent">
            <div className="form_container">
                <h4>Add new transaction</h4>
                <form>
                    <legend>Transaction Type</legend>
                    <label>
                        <input type="radio" name="transactionType" value="Income" required />
                        Income
                    </label>
                    <label>
                        <input type="radio" name="transactionType" value="Expense" required />
                        Expense
                    </label>

                    <label htmlFor="category">Category</label>
                    <select id="category" name="category" required>
                        <option value="NULL">Choose a category</option>
                        <option value="Food">Food</option>
                        <option value="Transportation">Transportation</option>
                        <option value="Shopping">Shopping</option>
                        <option value="Bills">Bills</option>
                        <option value="Others">Others</option>
                    </select>

                    <label htmlFor="date">Date</label>
                    <input type="date" name="date" placeholder="Date" required/>

                    <label htmlFor="amount">Amount</label>
                    <input type="number" name="amount" placeholder="Amount" required/>

                    <label htmlFor="description">Expense</label>
                    <input type="text" name="description" placeholder="Expense" required/>
                    
                    <button type="submit">Add Expense</button>
                </form>
            </div>
        </div>
    );
}

export default ExpenseTracker;
