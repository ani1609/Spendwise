import { useContext, useEffect } from "react";
import { addDoc, query, where, updateDoc, getDocs } from "firebase/firestore";
import { transactionsCollection } from "../firebaseConfig";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/ExpenseTracker.css";
import "../styles/TransactionForm.css";
import "../index.css";
import { ThemeContext } from "../context/ThemeContext";

function TransactionForm ({ user, editEnabled, setEditEnabled, formData, setFormData }) {
  const newTransaction = () => {
    setEditEnabled(false);
    const addedTransaction = {
      transactionType: "",
      category: "",
      date: "",
      description: "",
      amount: ""
    };
    setFormData(addedTransaction);
  };

  const generateTransactionId = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let transactionId = "";
    for (let i = 0; i < 10; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      transactionId += characters.charAt(randomIndex);
    }
    return transactionId;
  };

  const handleChange = (e) => {
    const targetValue = e.target.name === "amount" ? parseFloat(e.target.value) : e.target.value;
    setFormData({ ...formData, [e.target.name]: targetValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const today = new Date();
    if (formData.transactionType === "") {
      toast.error("Please select a transaction type.");
      return;
    }
    if (formData.transactionType === "Income" && formData.category !== "NULL") {
      setFormData({ ...formData, category: "NULL" });
    }
    if (formData.transactionType === "Expense" && formData.category === "") {
      toast.error("Please select a category.");
      return;
    }
    if (formData.date === "") {
      toast.error("Please select a date.");
      return;
    }
    const selectedDate = new Date(formData.date);
    if (selectedDate > today) {
      toast.error("Please select a date in the past or present.");
      return;
    }
    if (formData.amount === "") {
      toast.error("Please enter an amount.");
      return;
    }
    if (formData.description === "") {
      toast.error("Please enter a description.");
      return;
    }
    if (editEnabled) {
      try {
        const querySnapshot = await getDocs(
          query(transactionsCollection, where("transactionId", "==", formData.transactionId))
        );
        if (querySnapshot.empty) {
          toast.error("Transaction not found.");
        } else {
          const transactionDoc = querySnapshot.docs[0].ref;
          const transactionObject = {
            transactionType: formData.transactionType,
            category: formData.category,
            date: formData.date,
            amount: formData.amount,
            description: formData.description
          };
          await updateDoc(transactionDoc, transactionObject);
          setFormData({
            transactionType: "",
            category: "",
            date: "",
            amount: "",
            description: ""
          });
          setEditEnabled(false);
          toast.success("Transaction edited successfully.");
        }
      } catch (error) {
        toast.error("Error editing transaction.");
      }
    } else {
      try {
        const transactionObject = {
          email: user.email,
          transactionType: formData.transactionType,
          category: formData.category,
          date: formData.date,
          amount: formData.amount,
          description: formData.description,
          transactionId: generateTransactionId(),
          created_at: new Date()
        };
        await addDoc(transactionsCollection, transactionObject);
        setFormData({
          transactionType: "",
          category: "",
          date: "",
          amount: "",
          description: ""
        });
        toast.success("Transaction added successfully.");
      } catch (error) {
        toast.error("Error adding transaction.");
      }
    }
  };
  const { theme } = useContext(ThemeContext);
  useEffect(() => {
    if (formData.transactionType === "Income") {
      setFormData({ ...formData, category: "NULL" });
    }
  }, [formData.transactionType]);

  return (
    <div className="form_container border-[1.5px] rounded flex flex-col justify-between transition-all duration-500 dark:bg-[#011019]">
      <div className="flex flex-row items-start gap-5">
      {editEnabled
        ? (
            <>
            <h4 className="font-bold text-lg">Edit transaction</h4>
            <button
                type="button"
                className="text-white hover:text-gray-500 hover:bg-white bg-[#c465c9] border-[#c465c9] py-1 px-4 border transition-all duration-500"
                onClick={() => newTransaction()}
            >
                New
            </button>
            </>
          )
        : (
            <>
            <h4 className="font-bold text-lg">Add new transaction</h4>
            </>
          )
      }
      </div>

    <form className="flex justify-between" style={{ width: "100%" }}>
        <div className="flex flex-col justify-start" style={{ width: "45%" }}>
            <div className="flex flex-col" style={{ width: "100%" }}>
            <legend>Transaction Type</legend>
            <label style={{ cursor: "pointer" }}>
                <input
                type="radio"
                name="transactionType"
                value="Income"
                id="contactChoice1"
                checked={formData.transactionType === "Income"}
                onChange={handleChange}
                required
                className="cursor-pointer"
                />
                &nbsp;Income
            </label>
            <label style={{ cursor: "pointer" }}>
                <input
                type="radio"
                name="transactionType"
                id="contactChoice2"
                value="Expense"
                checked={formData.transactionType === "Expense"}
                onChange={handleChange}
                required
                className="cursor-pointer"
                />
                &nbsp;Expense
            </label>
            </div>
            <div className="flex flex-col" style={{ marginTop: "25px", width: "100%" }}>
            <label htmlFor="category">Category</label>
            <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                style={
                  {
                    cursor: formData.transactionType === "Income" ? "not-allowed" : "pointer"
                  }}
                disabled={formData.transactionType === "Income"}
                className="border sm:px-1 col-md-4 bg-transparent transition-[border-color] duration-500"
                placeholder="Category"
            >
                <option value="" hidden>
                Choose category
                </option>
                <option value="Food">Food</option>
                <option value="Travel">Travel</option>
                <option value="Shopping">Shopping</option>
                <option value="Bills">Bills</option>
                <option value="Others">Others</option>
            </select>
            </div>
            <div className="flex flex-col" style={{ marginTop: "25px", width: "100%" }}>
            <label htmlFor="date">Date</label>
            <input
                type="date"
                name="date"
                id="date"
                value={formData.date}
                onChange={handleChange}
                placeholder="Date"
                required
                className="cursor-pointer border bg-transparent h-7 px-1 col-md-4 transition-[border-color] duration-500"
            />
            </div>
        </div>

        <div className="flex flex-col justify-start" style={{ width: "45%" }}>
            <div className="flex flex-col" style={{ width: "100%" }}>
            <label htmlFor="amount">Amount</label>
            <input
                type="number"
                name="amount"
                id="number"
                value={formData.amount}
                onChange={handleChange}
                placeholder="Amount"
                required
                className="border p-2 transition-all duration-500 bg-transparent"
            />
            </div>
            <div className="flex flex-col" style={{ marginTop: "29px", width: "100%" }}>
            <label htmlFor="description" style={{ marginTop: "2px" }}>Description</label>
            <input
                type="text"
                id="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Description"
                required
                className="border p-2 transition duration-500 bg-transparent"
                autoComplete="off"
            />
            </div>
            <button
            type="submit"
            className="text-white hover:text-gray-500 border-[#c465c9] border transition-all duration-500 dark:border-[#B6CEFC80] bg-[#b6cefc] dark:bg-[#132B39]"
            onClick={handleSubmit}
            style={{ marginTop: "49px" }}
            >
            {editEnabled ? "Edit Transaction" : "Add Transaction"}
            </button>
        </div>
    </form>
    </div>
  );
}

export default TransactionForm;
