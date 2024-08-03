import { useEffect, useLayoutEffect, useState } from "react";
import "../styles/ExpenseTracker.css";
import "../index.css";
import { usersCollection } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DoughnutChart from "./DoughnutChart";
import Transactions from "./Transactions";
import TransactionForm from "./TransactionForm";

function ExpenseTracker() {
  const userJWTToken = JSON.parse(
    localStorage.getItem("expenseTrackerUserJWTToken")
  );
  const userFirebaseRefId = JSON.parse(
    localStorage.getItem("expenseTrackerUserFirebaseRefId")
  );
  const [user, setUser] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [formData, setFormData] = useState({
    email: "",
    transactionType: "",
    category: "",
    date: "",
    amount: "",
    description: "",
    transactionId: "",
  });
  const [balance, setBalance] = useState(0);
  const [incoming, setIncoming] = useState(0);
  const [outgoing, setOutgoing] = useState(0);
  const [editEnabled, setEditEnabled] = useState(false);
  const [descriptionChars, setDescriptionChars] = useState(0);

  const fetchUserFromFirebase = async (docrefId) => {
    try {
      const userDocRef = doc(usersCollection, docrefId);
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        setUser(userData);
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error fetching user from Firestore:", error);
      return null;
    }
  };

  useEffect(() => {
    if (userJWTToken) {
      fetchDataFromProtectedAPI(userJWTToken);
    }
    if (userFirebaseRefId) {
      fetchUserFromFirebase(userFirebaseRefId);
    }
  }, [userJWTToken, userFirebaseRefId]);

  useEffect(() => {
    let incoming = 0;
    let outgoing = 0;
    transactions.forEach((transaction) => {
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
    function updateSize() {
      const width = window.innerWidth;
      setDescriptionChars(
        width <= 320
          ? 5
          : width <= 375
          ? 8
          : width <= 480
          ? 12
          : width <= 768
          ? 20
          : 22
      );
    }
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <div className="expenseTracker_parent">
      <div className="balance_container border-[1.5px] rounded transition-colors border-[#a6c3fa]">
        <h3 className="select-none">Your Balance-</h3>
        <h1 className="select-none">&#x20B9;{balance}</h1>
      </div>
      <div className="formTransactions_container flex justify-evenly dark:text-[#B6CEFC80]">
        <TransactionForm
          user={user}
          editEnabled={editEnabled}
          setEditEnabled={setEditEnabled}
          formData={formData}
          setFormData={setFormData}
        />

        <div className="WalletDetails_container flex flex-col">
          <div className="incomeExpense_container border border-border rounded flex justify-around gap-2 transition-colors bg-secondary-bg">
            <h3 className="flex flex-col items-center text-text text-lg">
              Income
              <span className="text-green-600 text-xl">
                + &#x20B9;{incoming}
              </span>
            </h3>
            <h3 className="flex flex-col items-center text-text">
              Expense
              <span className="text-red-600 text-xl">- &#x20B9;{outgoing}</span>
            </h3>
          </div>
          <Transactions
            transactions={transactions}
            setTransactions={setTransactions}
            user={user}
            setEditEnabled={setEditEnabled}
            setFormData={setFormData}
            descriptionChars={descriptionChars}
          />
        </div>
      </div>
      {transactions.length > 0 && <DoughnutChart transactions={transactions} />}
      <ToastContainer />
    </div>
  );
}

export default ExpenseTracker;
