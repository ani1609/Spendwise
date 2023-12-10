import { useEffect, useLayoutEffect, useState } from "react";
import axios from "axios";
import "../styles/ExpenseTracker.css";
import "../index.css";
import {
  query,
  where,
  onSnapshot,
  orderBy,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { transactionsCollection } from "../firebaseConfig";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ReactComponent as Edit } from "../icons/edit.svg";
import { ReactComponent as Delete } from "../icons/delete.svg";
import { ReactComponent as Food } from "../icons/food.svg";
import { ReactComponent as Travel } from "../icons/travel.svg";
import { ReactComponent as Shopping } from "../icons/shopping.svg";
import { ReactComponent as Bills } from "../icons/bills.svg";
import { ReactComponent as Others } from "../icons/others.svg";
import { ReactComponent as Plus } from "../icons/plus1.svg";
import DoughnutChart from "./DoughnutChart";
import MyLoader from "./TransactionLoading";

import TransactionForm from "./TransactionForm";

function ExpenseTracker() {
  const userToken = JSON.parse(localStorage.getItem("expenseTrackerUserToken"));
  const [user, setUser] = useState({});
  const [dateFillter, setDateFilter] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [transactionFilter, setTransactionFilter] = useState([]);
  const [transactionType, setTransactionType] = useState("");
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
  const [transactionsLoading, setTransactionsLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [descriptionChars, setDescriptionChars] = useState(0);

  const fetchDataFromProtectedAPI = async (userToken) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      };
      // const response = await axios.get(`${process.env.REACT_APP_SERVER_PORT}/api/user`, config);
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/api/user`,
        config
      );
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
  }, [userToken]);

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

  useEffect(() => {
    if (user && user.email) {
      const q = query(
        transactionsCollection,
        where("email", "==", user.email),
        orderBy("created_at", "asc") // or 'asc' for ascending order
      );
    }
  }, []);

  useEffect(() => {
    if (user && user.email) {
      const q = query(
        transactionsCollection,
        where("email", "==", user.email),
        orderBy("created_at", "asc") // or 'asc' for ascending order
      );

      return onSnapshot(q, (snapshot) => {
        let updatedTransactions = snapshot.docs.map((doc) => doc.data());
        setTransactions(updatedTransactions);
        let transactiontype = localStorage.getItem("transactionType")
          ? localStorage.getItem("transactionType")
          : "";
        let datefiter = localStorage.getItem("dateFilter")
          ? localStorage.getItem("dateFilter")
          : "";

        if (transactiontype && transactiontype != "all")
          updatedTransactions = updatedTransactions.filter(
            (item) => item.transactionType == transactiontype
          );
        if (datefiter) {
          updatedTransactions = updatedTransactions.filter(
            (item) => item.date == datefiter
          );
        }
        if (categoryFilter && categoryFilter != "all") {
          updatedTransactions = updatedTransactions.filter(
            (item) => item.category === categoryFilter
          );
        }
        if (datefiter) {
          updatedTransactions = updatedTransactions.filter(
            (item) => item.date == datefiter
          );
        }

        setTransactionFilter(updatedTransactions);

        if (transactionsLoading) {
          setTransactionsLoading(false);
        }
      });
    }
  }, [user, transactionType, categoryFilter, dateFillter]);
  useEffect(() => {
    localStorage.removeItem("transactionType");
    localStorage.removeItem("dateFilter");
  }, []);

  const handleEdit = (transactionId, index) => {
    setEditEnabled(true);

    const editedTransaction = {
      ...transactions.filter((e) => e.transactionId == transactionId)[0],
    };
    console.log(editedTransaction, transactions, transactionId);
    const date = new Date(editedTransaction.date);
    const formattedDate = date.toISOString().split("T")[0];
    editedTransaction.date = formattedDate;
    setFormData(editedTransaction);
  };

  const handleDelete = async (transactionId, index) => {
    try {
      const querySnapshot = await getDocs(
        query(
          transactionsCollection,
          where("transactionId", "==", transactionId)
        )
      );

      if (querySnapshot.empty) {
        toast.error("Transaction not found.");
      } else {
        const transactionDoc = querySnapshot.docs[0].ref;
        await deleteDoc(transactionDoc);
        toast.success("Transaction deleted successfully.");
      }
    } catch (error) {
      toast.error("Error deleting transaction.");
    }
  };
  const TransactionTypeChange = (e) => {
    if (e.target.value == "all") {
      let transactionnews = transactions;
      if (dateFillter)
        transactionnews = transactionnews.filter(
          (item) => item.date == dateFillter
        );
      setTransactionFilter(transactionnews);
    } else {
      let transactionnews = transactions.filter(
        (item) => item.transactionType == e.target.value
      );
      if (dateFillter)
        transactionnews = transactionnews.filter(
          (item) => item.date == dateFillter
        );
      setTransactionFilter(transactionnews);
    }
    if (e.target.value) {
      localStorage.setItem("transactionType", e.target.value);
    } else localStorage.removeItem("transactionType");
    setTransactionType(e.target.value);
    setCategoryFilter("");
  };

  const CategoryChange = (e) => {
    setCategoryFilter(e.target.value);
  };

  const changeDateFilter = (e) => {
    if (e.target.value) {
      let transactionsfilter = transactions.filter(
        (item) => item.date == e.target.value
      );
      if (transactionType && transactionType != "all")
        transactionsfilter = transactionsfilter.filter(
          (item) => item.transactionType == transactionType
        );
      setTransactionFilter(transactionsfilter);
      localStorage.setItem("dateFilter", e.target.value);
    } else {
      let transactionsfilter = transactions;

      if (transactionType && transactionType != "all")
        transactionsfilter = transactionsfilter.filter(
          (item) => item.transactionType == transactionType
        );

      setTransactionFilter(transactionsfilter);
      localStorage.removeItem("dateFilter");
    }

    setDateFilter(e.target.value);
  };
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
      <div className="balance_container border-2 rounded">
        <h3>Your Balance-</h3>
        <h1>&#x20B9;{balance}</h1>
      </div>
      <div className="formTransactions_container flex justify-evenly">
        <TransactionForm
          user={user}
          formData={formData}
          setFormData={setFormData}
          editEnabled={editEnabled}
          setEditEnabled={setEditEnabled}
        />

        <div className="WalletDetails_container flex flex-col">
          <div className="incomeExpense_container border-2 rounded flex justify-around gap-2">
            <h3 className="flex flex-col items-center">
              Income
              <span className="text-green-600 text-xl">
                + &#x20B9;{incoming}
              </span>
            </h3>
            <h3 className="flex flex-col items-center">
              Expense
              <span className="text-red-600 text-xl">- &#x20B9;{outgoing}</span>
            </h3>
          </div>
          <div className="transaction-group row flex flex-col mb-2">
            <h4 className="font-bold">Transactions</h4>
            <div className="flex justify-between">
              <div className="form-group col-md-4">
                <select
                  id="inputState"
                  className="form-control border border-slate-500 rounded-md bg-transparent h-7 px-1"
                  onChange={(e) => TransactionTypeChange(e)}
                  value={transactionType}
                >
                  <option value={""} hidden>
                    Type
                  </option>
                  <option value={"all"}>All</option>
                  <option value={"Income"}>Income</option>
                  <option value={"Expense"}>Expense</option>
                </select>
              </div>
              <div>
                <select
                  id="categoryFilter"
                  className="form-control border border-slate-500 rounded-md bg-transparent h-7 px-1 col-md-4"
                  onChange={(e) => CategoryChange(e)}
                  value={categoryFilter}
                >
                  <option value="" hidden>
                    Category
                  </option>
                  <option value="all">All</option>
                  <option value="Food">Food</option>
                  <option value="Travel">Travel</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Bills">Bills</option>
                  <option value="Others">Others</option>
                </select>
              </div>
              <input
                type="date"
                name="date"
                value={dateFillter}
                onChange={(e) => changeDateFilter(e)}
                placeholder="Date"
                required
                className="cursor-pointer max_with border border-slate-500 rounded-md bg-transparent h-7 px-1"
              />
            </div>
          </div>

          <hr></hr>
          {transactionFilter.length > 0 ? (
            <ul className="transactions_container flex flex-col gap-2">
              {transactionFilter.map((transaction, index) =>
                transaction.transactionType === "Income" ? (
                  <li
                    key={index}
                    className="income flex justify-between items-center border-2 rounded p-2"
                  >
                    <div className="icon_container">
                      <Plus className="icons" />
                    </div>
                    <div className="descDate_container">
                      {transaction.description.length > descriptionChars ? (
                        <h4>
                          {transaction.description.substring(
                            0,
                            descriptionChars
                          ) + "..."}
                        </h4>
                      ) : (
                        <h4>{transaction.description}</h4>
                      )}
                      <p>{new Date(transaction.date).toLocaleDateString()}</p>
                    </div>
                    <h1>+&#x20B9;{transaction.amount}</h1>
                    <div className="editDelete_container">
                      <Edit
                        className="edit_icon"
                        onClick={() =>
                          handleEdit(transaction.transactionId, index)
                        }
                      />
                      <Delete
                        className="delete_icon"
                        onClick={() =>
                          handleDelete(transaction.transactionId, index)
                        }
                      />
                    </div>
                  </li>
                ) : (
                  <li
                    key={index}
                    className="outcome flex justify-between items-center border-2 rounded p-2"
                  >
                    <div className="icon_container">
                      {transaction.category === "Food" ? (
                        <Food className="icons" />
                      ) : null}
                      {transaction.category === "Travel" ? (
                        <Travel className="icons" />
                      ) : null}
                      {transaction.category === "Shopping" ? (
                        <Shopping className="icons" />
                      ) : null}
                      {transaction.category === "Bills" ? (
                        <Bills className="icons" />
                      ) : null}
                      {transaction.category === "Others" ? (
                        <Others className="icons" />
                      ) : null}
                    </div>
                    <div className="descDate_container">
                      {transaction.description.length > descriptionChars ? (
                        <h4>
                          {transaction.description.substring(
                            0,
                            descriptionChars
                          ) + "..."}
                        </h4>
                      ) : (
                        <h4>{transaction.description}</h4>
                      )}
                      <p>{new Date(transaction.date).toLocaleDateString()}</p>
                    </div>
                    <h1>-&#x20B9;{transaction.amount}</h1>
                    <div className="editDelete_container">
                      <Edit
                        className="edit_icon"
                        onClick={() =>
                          handleEdit(transaction.transactionId, index)
                        }
                      />
                      <Delete
                        className="delete_icon"
                        onClick={() =>
                          handleDelete(transaction.transactionId, index)
                        }
                      />
                    </div>
                  </li>
                )
              )}
            </ul>
          ) : transactionsLoading ? (
            <MyLoader />
          ) : (
            <p className="text-gray-400">No transactions added yet.</p>
          )}
        </div>
      </div>

      {transactions.length > 0 && <DoughnutChart transactions={transactions} />}
      <ToastContainer />
    </div>
  );
}

export default ExpenseTracker;
