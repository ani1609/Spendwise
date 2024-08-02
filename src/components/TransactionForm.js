import { useContext, useEffect } from "react";
import { addDoc, query, where, updateDoc, getDocs } from "firebase/firestore";
import { transactionsCollection } from "../firebaseConfig";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/ExpenseTracker.css";
import "../styles/TransactionForm.css";
import "../index.css";
import { ThemeContext } from "../context/ThemeContext";

function TransactionForm({
  user,
  editEnabled,
  setEditEnabled,
  formData,
  setFormData,
}) {
  const newTransaction = () => {
    setEditEnabled(false);
    const addedTransaction = {
      transactionType: "",
      category: "",
      date: "",
      description: "",
      amount: "",
    };
    setFormData(addedTransaction);
  };

  const generateTransactionId = () => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let transactionId = "";
    for (let i = 0; i < 10; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      transactionId += characters.charAt(randomIndex);
    }
    return transactionId;
  };

  const handleChange = (e) => {
    const targetValue =
      e.target.name === "amount" ? parseFloat(e.target.value) : e.target.value;
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
          query(
            transactionsCollection,
            where("transactionId", "==", formData.transactionId)
          )
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
            description: formData.description,
          };
          await updateDoc(transactionDoc, transactionObject);
          setFormData({
            transactionType: "",
            category: "",
            date: "",
            amount: "",
            description: "",
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
          created_at: new Date(),
        };
        await addDoc(transactionsCollection, transactionObject);
        setFormData({
          transactionType: "",
          category: "",
          date: "",
          amount: "",
          description: "",
        });
        toast.success("Transaction added successfully.");
      } catch (error) {
        toast.error("Error adding transaction.");
      }
    }
  };

  useEffect(() => {
    if (formData.transactionType === "Income") {
      setFormData({ ...formData, category: "NULL" });
    }
  }, [formData.transactionType]);

  return (
    <div className="form_container border border-border rounded flex flex-col justify-between transition-colors bg-secondary-bg">
      <div className="flex flex-row items-start gap-5">
        {editEnabled ? (
          <>
            <h4 className="font-bold text-lg text-text">Edit transaction</h4>
            <button
              type="button"
              className="text-text rounded py-1 px-4 border border-border transition-colors"
              onClick={() => newTransaction()}
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <h4 className="font-bold text-lg text-text">Add new transaction</h4>
          </>
        )}
      </div>

      <form
        className="flex justify-between text-text"
        style={{ width: "100%" }}
      >
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
                className="cursor-pointer border-[2px] border-border"
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
                className="cursor-pointer border-[2px] border-border"
              />
              &nbsp;Expense
            </label>
          </div>
          <div
            className="flex flex-col"
            style={{ marginTop: "30px", width: "100%" }}
          >
            <label htmlFor="category">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              style={{
                cursor:
                  formData.transactionType === "Income"
                    ? "not-allowed"
                    : "pointer",
              }}
              disabled={formData.transactionType === "Income"}
              className="bg-transparent border px-1 h-10 mt-1.5 rounded border-border transition-colors outline-none"
              placeholder="Category"
            >
              <option value="" hidden className="">
                Choose category
              </option>
              <option
                value="Food"
                className="bg-white dark:bg-[#011019] text-start cursor-pointer px-4 py-[2.5px] bg-primary-bg hover:text-[#ffffff]"
              >
                Food
              </option>
              <option
                value="Travel"
                className="bg-white dark:bg-[#011019] text-start cursor-pointer px-4 py-[2.5px] bg-primary-bg hover:text-[#ffffff]"
              >
                Travel
              </option>
              <option
                value="Shopping"
                className="bg-white dark:bg-[#011019] text-start cursor-pointer px-4 py-[2.5px] bg-primary-bg hover:text-[#ffffff]"
              >
                Shopping
              </option>
              <option
                value="Bills"
                className="bg-white dark:bg-[#011019] text-start cursor-pointer px-4 py-[2.5px] bg-primary-bg hover:text-[#ffffff]"
              >
                Bills
              </option>
              <option
                value="Others"
                className="bg-white dark:bg-[#011019] text-start cursor-pointer px-4 py-[2.5px] bg-primary-bg hover:text-[#ffffff]"
              >
                Others
              </option>
            </select>
          </div>
          <div
            className="flex flex-col"
            style={{ marginTop: "30px", width: "100%" }}
          >
            <label htmlFor="date">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              placeholder="Date"
              required
              className="cursor-pointer rounded border px-1 h-10 mt-1.5 border-border transition-colors bg-transparent text-gray-400 dark:text-gray-500 outline-none"
            />
          </div>
        </div>

        <div className="flex flex-col justify-start" style={{ width: "45%" }}>
          <div className="flex flex-col" style={{ width: "100%" }}>
            <label htmlFor="amount">Amount</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="Amount"
              required
              className="bg-transparent border px-1 h-10 mt-1.5 rounded border-border transition-colors placeholder:text-gray-400 dark:placeholder:text-gray-500 text-text outline-none"
              autoComplete="off"
            />
          </div>
          <div
            className="flex flex-col"
            style={{ marginTop: "32px", width: "100%" }}
          >
            <label htmlFor="description">Description</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description"
              required
              className="bg-transparent border px-1 h-10 mt-1.5 rounded border-border transition-colors placeholder:text-gray-400 dark:placeholder:text-gray-500 text-text outline-none"
              autoComplete="off"
            />
          </div>
          <button
            type="submit"
            className="h-10 mt-auto rounded box-border text-[#ffffff] transition-colors bg-primary-bg"
            onClick={handleSubmit}
          >
            {editEnabled ? "Edit Transaction" : "Add Transaction"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default TransactionForm;
