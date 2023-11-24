import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/ExpenseTracker.css";
import {ReactComponent as Edit} from '../icons/edit.svg';
import {ReactComponent as Delete} from '../icons/delete.svg';
import { set } from "mongoose";


function ExpenseTracker() 
{
    const userToken = JSON.parse(localStorage.getItem('expenseTrackerUserToken'));
    const [transactions, setTransactions] = useState([]);
    const [formData, setFormData] = useState({
        transactionType: "",
        category: "",
        date: "",
        amount: "",
        description: "",
        transactionId: ""
    });
    const [balance, setBalance] = useState(0);
    const [incoming, setIncoming] = useState(0);
    const [outgoing, setOutgoing] = useState(0);
    const [editEnabled, setEditEnabled] = useState(false);
    const [editIndex, setEditIndex] = useState(0);
    const [editTransactionId, setEditTransactionId] = useState(0);



    const fetchTransactions= async (userToken) =>
    {
        try
        {
            const config = 
            {
                headers:
                {
                    Authorization: `Bearer ${userToken}`,
                },
            };
            const response = await axios.get("http://localhost:3000/api/users/fetchTransactions", config);
            console.log(response.data.transactions);
            setTransactions(response.data.transactions);
        }
        catch (error)
        {
            console.error("Error fetching transactions:", error);
        }
    };

    useEffect(() =>
    {
        if (userToken)
        {
            fetchTransactions(userToken);
        }
    }, [userToken]);

    useEffect(() =>
    {
        let incoming = 0;
        let outgoing = 0;
        transactions.forEach(transaction =>
        {
            if(transaction.transactionType === "Income")
            {
                incoming += transaction.amount;
            }
            else
            {
                outgoing += transaction.amount;
            }
        });
        setIncoming(incoming);
        setOutgoing(outgoing);
        setBalance(incoming - outgoing);
    }, [transactions]);

    const handleChange = (e) => 
    {
        const targetValue = e.target.name === 'amount' ? parseFloat(e.target.value) : e.target.value;
        setFormData({ ...formData, [e.target.name]: targetValue });
    };

    const handleSubmit = async (e) => 
    {
        e.preventDefault();
        if (editEnabled)
        {
            if (editIndex >= 0 && editIndex < transactions.length) 
            {
                const updatedTransaction = { ...transactions[editIndex], ...formData };
                const updatedTransactions = [...transactions];
                updatedTransactions[editIndex] = updatedTransaction;
                setTransactions(updatedTransactions);
            } 
            else 
            {
                console.log("Invalid index");
            }
            try 
            {
                const config = 
                {
                    headers: 
                    {
                        Authorization: `Bearer ${userToken}`,
                    },
                };
                const response = await axios.post("http://localhost:3000/api/users/editTransaction", formData, config);
                console.log("Transaction edited successfully");
                setFormData({
                    transactionType: "",
                    category: "",
                    date: "",
                    amount: "",
                    description: "",
                    transactionId: ""
                });
            }
            catch (error) 
            {
                console.error("Error adding transaction:", error.message);
            }
        }
        else
        {
            setTransactions([...transactions, formData]);
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
                console.log("Transaction added successfully");
                setFormData({
                    transactionType: "",
                    category: "",
                    date: "",
                    amount: "",
                    description: "",
                    transactionId: ""
                });
            }
            catch (error) 
            {
                console.error("Error adding transaction:", error.message);
            }
        }
    };

    const handleEdit = (transactionId, index) =>
    {
        setEditEnabled(true);
        console.log("Edit clicked at index ", index);
        setEditIndex(index);
        setEditTransactionId(transactionId);
        const editedTransaction = { ...transactions[index] };

        const date = new Date(editedTransaction.date);
        const formattedDate = date.toISOString().split('T')[0];
        editedTransaction.date = formattedDate;
        setFormData(editedTransaction);
    }

    const handleDelete = async (transactionId, index) =>
    {
        console.log("Delete clicked at indexxx ", transactionId);
        const newTransactions = [...transactions];
        newTransactions.splice(index, 1);
        setTransactions(newTransactions);
        try 
        {
            const config = 
            {
                headers: 
                {
                    Authorization: `Bearer ${userToken}`,
                },
            };
            const response = await axios.post("http://localhost:3000/api/users/deleteTransaction", {transactionId}, config);
            console.log("Transaction deleted successfully");
        }
        catch (error) 
        {
            console.error("Error adding transaction:", error.message);
        }
    }

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
                    <button type="submit" onClick={handleSubmit}> {editEnabled? "Edit Transaction" : "Add Transaction"} </button>
                </form>
            </div>

            <div className="WalletDetails_container">
                <h2>Balance <strong>{balance}</strong></h2>
                <h3><strong>Income </strong>{incoming}</h3>
                <h3><strong>Expense </strong>{outgoing}</h3>
                <h4>Transactions</h4>
                {transactions.length > 0 ? (
                    transactions.map((transaction, index) =>
                    (
                        <ul key={index}>
                            <li><strong>Transaction type </strong>{transaction.transactionType}</li>
                            <li><strong>Category </strong>{transaction.category}</li>
                            <li><strong>Date </strong>{new Date(transaction.date).toLocaleDateString()}</li>
                            <li><strong>Amount </strong>{transaction.amount}</li>
                            <li><strong>Description </strong>{transaction.description}</li>
                            <li><Edit className="edit_icon" onClick={()=>handleEdit(transaction.transactionId, index)}/></li>
                            <li><Delete className="delete_icon" onClick={()=>handleDelete(transaction.transactionId, index)}/></li>
                        </ul>
                    ))
                ) : (
                    <p>No transactions added yet.</p>
                )}
            </div>
        </div>
    );
}

export default ExpenseTracker;
