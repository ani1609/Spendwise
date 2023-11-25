import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/ExpenseTracker.css";
import "../index.css";
import { ReactComponent as Edit } from '../icons/edit.svg';
import { ReactComponent as Delete } from '../icons/delete.svg';
import { ReactComponent as Food } from '../icons/food.svg';
import { ReactComponent as Travel } from '../icons/travel.svg';
import { ReactComponent as Shopping } from '../icons/shopping.svg';
import { ReactComponent as Bills } from '../icons/bills.svg';
import { ReactComponent as Others } from '../icons/others.svg';
import DoughnutChart from "./DoughnutChart";


function ExpenseTracker() {
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



    const fetchTransactions = async (userToken) => {
        try {
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
        catch (error) {
            console.error("Error fetching transactions:", error);
        }
    };

    useEffect(() => {
        if (userToken) {
            fetchTransactions(userToken);
        }
    }, [userToken]);

    useEffect(() => {
        let incoming = 0;
        let outgoing = 0;
        transactions.forEach(transaction => {
            if (transaction.transactionType === "Income") {
                incoming += transaction.amount;
            }
            else {
                outgoing += transaction.amount;
            }
        });
        setIncoming(incoming);
        setOutgoing(outgoing);
        setBalance(incoming - outgoing);
    }, [transactions]);

    const handleChange = (e) => {
        const targetValue = e.target.name === 'amount' ? parseFloat(e.target.value) : e.target.value;
        setFormData({ ...formData, [e.target.name]: targetValue });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editEnabled) {
            if (editIndex >= 0 && editIndex < transactions.length) {
                const updatedTransaction = { ...transactions[editIndex], ...formData };
                const updatedTransactions = [...transactions];
                updatedTransactions[editIndex] = updatedTransaction;
                setTransactions(updatedTransactions);
            }
            else {
                console.log("Invalid index");
            }
            try {
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
            catch (error) {
                console.error("Error adding transaction:", error.message);
            }
        }
        else {
            setTransactions([...transactions, formData]);
            try {
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
            catch (error) {
                console.error("Error adding transaction:", error.message);
            }
        }
    };

    const handleEdit = (transactionId, index) => {
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

    const handleDelete = async (transactionId, index) => {
        console.log("Delete clicked at indexxx ", transactionId);
        const newTransactions = [...transactions];
        newTransactions.splice(index, 1);
        setTransactions(newTransactions);
        try {
            const config =
            {
                headers:
                {
                    Authorization: `Bearer ${userToken}`,
                },
            };
            const response = await axios.post("http://localhost:3000/api/users/deleteTransaction", { transactionId }, config);
            console.log("Transaction deleted successfully");
        }
        catch (error) {
            console.error("Error adding transaction:", error.message);
        }
    }

    return (
        <div className="expenseTracker_parent">
            <div className="balance_container border-2 rounded">
                <h3>Your Balance</h3>
                <h1>&#x20B9;{balance}</h1>
            </div>
            <div className="formTransactions_container flex justify-evenly">
                <div className="form_container border-2 rounded p-8">
                    <h4 className="font-bold text-lg mb-10">Add new transaction</h4>
                    <form className="flex gap-4">
                        <div className="flex flex-col gap-2">
                            <legend>Transaction Type</legend>
                            <label>
                                <input
                                    type="radio"
                                    name="transactionType"
                                    value="Income"
                                    checked={formData.transactionType === "Income"}
                                    onChange={handleChange}
                                    required
                                    className="cursor-pointer"
                                />&nbsp;
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
                                    className="cursor-pointer"
                                />&nbsp;
                                Expense
                            </label>
                            <label htmlFor="category" className="mt-4">Category</label>
                            <select
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                                className="cursor-pointer"
                            >
                                <option value="NULL">Choose a category</option>
                                <option value="Food">Food</option>
                                <option value="Travel">Travel</option>
                                <option value="Shopping">Shopping</option>
                                <option value="Bills">Bills</option>
                                <option value="Others">Others</option>
                            </select>
                            <label htmlFor="date" className="mt-4">Date</label>
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                placeholder="Date"
                                required
                                className="cursor-pointer"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="amount">Amount</label>
                            <input
                                type="number"
                                name="amount"
                                value={formData.amount}
                                onChange={handleChange}
                                placeholder="Amount"
                                required
                                className="border-2 p-2"
                            />
                            <label htmlFor="description" className="mt-4">Description</label>
                            <input
                                type="text"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Description"
                                required
                                className="border-2 p-2"
                            />
                            <button type="submit" className="border-2 mt-4 text-white p-2" onClick={handleSubmit}> {editEnabled ? "Edit Transaction" : "Add Transaction"} </button>
                        </div>
                    </form>
                </div>
            

                <div className="WalletDetails_container flex flex-col">
                    <div className="incomeExpense_container border-2 rounded flex justify-around gap-2">
                        <h3 className="flex flex-col items-center">Income<span className="text-green-600 text-xl">+ &#x20B9;{incoming}</span></h3>
                        <h3 className="flex flex-col items-center">Expense<span className="text-red-600 text-xl">- &#x20B9;{outgoing}</span></h3>
                    </div>
                    <h4>Transactions</h4><hr></hr>
                    {transactions.length > 0 ? (
                        <ul className="transactions_container flex flex-col gap-2">
                            {transactions.map((transaction, index) => (
                                transaction.transactionType === "Income" ?
                                (   
                                    <li key={index} className="income flex justify-between items-center border-2 rounded p-2">
                                        <div className="icon_container">
                                            {transaction.category === "Food" ? <Food className="icons" /> : null}
                                            {transaction.category === "Travel" ? <Travel className="icons" /> : null}
                                            {transaction.category === "Shopping" ? <Shopping className="icons" /> : null}
                                            {transaction.category === "Bills" ? <Bills className="icons" /> : null}
                                            {transaction.category === "Others" ? <Others className="icons" /> : null}
                                        </div>
                                        <div className="descDate_container">
                                            <h4>{transaction.description}</h4>
                                            <p>{new Date(transaction.date).toLocaleDateString()}</p>
                                        </div>
                                        <h1>+{transaction.amount}</h1>
                                        <div className="editDelete_container">
                                            <Edit className="edit_icon" onClick={() => handleEdit(transaction.transactionId, index)} />
                                            <Delete className="delete_icon" onClick={() => handleDelete(transaction.transactionId, index)} />
                                        </div>
                                    </li>
                                ) : (
                                    <li key={index} className="outcome flex justify-between items-center border-2 rounded p-2">
                                        <div className="icon_container">
                                            {transaction.category === "Food" ? <Food className="icons" /> : null}
                                            {transaction.category === "Travel" ? <Travel className="icons" /> : null}
                                            {transaction.category === "Shopping" ? <Shopping className="icons" /> : null}
                                            {transaction.category === "Bills" ? <Bills className="icons" /> : null}
                                            {transaction.category === "Others" ? <Others className="icons" /> : null}
                                        </div>
                                        <div className="descDate_container">
                                            <h4>{transaction.description}</h4>
                                            <p>{new Date(transaction.date).toLocaleDateString()}</p>
                                        </div>
                                        <h1>-{transaction.amount}</h1>
                                        <div className="editDelete_container">
                                            <Edit className="edit_icon" onClick={() => handleEdit(transaction.transactionId, index)} />
                                            <Delete className="delete_icon" onClick={() => handleDelete(transaction.transactionId, index)} />
                                        </div>
                                    </li>
                                )
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-400">No transactions added yet.</p>
                    )}
                </div>
            </div>
            {/* {transactions.length > 0 && <DoughnutChart transactions={transactions} />} */}
        </div>
    );
}

export default ExpenseTracker;