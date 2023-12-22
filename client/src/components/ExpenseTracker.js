import { useEffect, useLayoutEffect, useState } from "react";
import axios from "axios";
import "../styles/ExpenseTracker.css";
import "../index.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DoughnutChart from "./DoughnutChart";
import Transactions from "./Transactions";
import TransactionForm from "./TransactionForm";

function ExpenseTracker () {
  const userToken = JSON.parse(localStorage.getItem("expenseTrackerUserToken"));
  const [user, setUser] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [formData, setFormData] = useState({
    email: "",
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
  const [descriptionChars, setDescriptionChars] = useState(0);

  const fetchDataFromProtectedAPI = async (userToken) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userToken}`
        }
      };
      // const response = await axios.get(`${process.env.REACT_APP_SERVER_PORT}/api/user`, config);
      const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/user`, config);
      setUser(response.data.user);
      // console.log(response.data.user);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (userToken) {
      fetchDataFromProtectedAPI(userToken);
    }
  }
  , [userToken]);

  useEffect(() => {
    let incoming = 0;
    let outgoing = 0;
    transactions.forEach(transaction => {
      if (transaction.transactionType === "Income") {
        incoming += transaction.amount;
      } else {
        outgoing += transaction.amount;
      }
    });
    setIncoming(incoming);
    setOutgoing(outgoing);
    setBalance(incoming - outgoing);
  }, [transactions]);

  useLayoutEffect(() => {
    function updateSize () {
      const width = window.innerWidth;
      setDescriptionChars(width <= 320
        ? 5
        : width <= 375
          ? 8
          : width <= 480 ? 12 : width <= 768 ? 20 : 22);
    }
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
        <div className="expenseTracker_parent">
            <div className="balance_container border-2 rounded">
                <h3>Your Balance-</h3>
                <h1>&#x20B9;{balance}</h1>
            </div>
            <div className="formTransactions_container flex justify-evenly">
              <TransactionForm user={user} editEnabled={editEnabled} setEditEnabled={setEditEnabled} formData={formData} setFormData={setFormData} />

                <div className="WalletDetails_container flex flex-col">
                    <div className="incomeExpense_container border-2 rounded flex justify-around gap-2">
                        <h3 className="flex flex-col items-center">Income<span className="text-green-600 text-xl">+ &#x20B9;{incoming}</span></h3>
                        <h3 className="flex flex-col items-center">Expense<span className="text-red-600 text-xl">- &#x20B9;{outgoing}</span></h3>
                    </div>
                    <Transactions transactions={transactions} setTransactions={setTransactions} user={user} setEditEnabled={setEditEnabled} setFormData={setFormData} descriptionChars={descriptionChars}/>
                </div>
            </div>
            {transactions.length > 0 && <DoughnutChart transactions={transactions} />}
            <ToastContainer />
        </div>
  );
}

export default ExpenseTracker;
