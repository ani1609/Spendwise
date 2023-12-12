import React, { useState } from "react";
import { transactionsCollection } from "../firebaseConfig";
import { toast } from "react-toastify";

import { addDoc, query, where, updateDoc, getDocs } from "firebase/firestore";

function generateTransactionId() {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let transactionId = "";
  for (let i = 0; i < 10; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    transactionId += characters.charAt(randomIndex);
  }
  return transactionId;
}

const TransactionForm = ({
  editEnabled,
  setEditEnabled,
  user,
  formData,
  setFormData,
}) => {
  const handleSubmit = async (e) => {
    e.preventDefault();
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
    if (formData.amount === "") {
      toast.error("Please enter an amount.");
      return;
    }
    if (formData.description === "") {
      toast.error("Please enter a description.");
      return;
    }
    if (editEnabled) {
      console.log("edit clicked ", formData.transactionId);
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
        console.log(transactionObject);
        await addDoc(transactionsCollection, transactionObject);
        // console.log('Transaction ID:', newTransactionRef.id);
        setFormData({
          transactionType: "",
          category: "",
          date: "",
          amount: "",
          description: "",
        });
        toast.success("Transaction added successfully.");
      } catch (error) {
        console.log(error);
        toast.error("Error adding transaction.");
      }
    }
  };

  const newTransaction = () => {
    setEditEnabled(false);
    let addedTransaction = {
      transactionType: "",
      category: "",
      date: "",
      description: "",
      amount: "",
    };
    setFormData(addedTransaction);
  };

  const handleChange = (e) => {
    const targetValue =
      e.target.name === "amount" ? parseFloat(e.target.value) : e.target.value;
    setFormData({ ...formData, [e.target.name]: targetValue });
  };

  return (
    <div className="form_container border-2 rounded p-8">
      <div className="form-title">
        {editEnabled ? (
          <>
            <h4 className="font-bold text-lg mb-10 edittransaction">
              Edit transaction
            </h4>
            <button
              type="button"
              class="btn-new mb-8"
              onClick={() => newTransaction()}
            >
              New
            </button>
          </>
        ) : (
          <>
            <h4 className="font-bold text-lg mb-10">Add new transaction</h4>
          </>
        )}
      </div>

      <form className="flex gap-4">
        <div className="flex flex-col gap-2">
          <legend>Transaction Type</legend>
          <label style={{ cursor: "pointer" }}>
            <input
              type="radio"
              name="transactionType"
              value="Income"
              checked={formData.transactionType === "Income"}
              onChange={handleChange}
              required
              className="cursor-pointer"
            />
            &nbsp; Income
          </label>
          <label style={{ cursor: "pointer" }}>
            <input
              type="radio"
              name="transactionType"
              value="Expense"
              checked={formData.transactionType === "Expense"}
              onChange={handleChange}
              required
              className="cursor-pointer"
            />
            &nbsp; Expense
          </label>
          <label htmlFor="category" className="mt-4">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            style={{
              cursor:
                formData.transactionType === "Income" ? "auto" : "pointer",
            }}
            disabled={formData.transactionType === "Income"}
          >
            <option value="NULL">Choose a category</option>
            <option value="Food">Food</option>
            <option value="Travel">Travel</option>
            <option value="Shopping">Shopping</option>
            <option value="Bills">Bills</option>
            <option value="Others">Others</option>
          </select>
          <label htmlFor="date" className="mt-4">
            Date
          </label>
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
          <label htmlFor="description" className="mt-4">
            Description
          </label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            required
            className="border-2 p-2"
            autoComplete="off"
          />
          <button
            type="submit"
            className=" mt-4 text-white hover:text-gray-500 hover:bg-white border-[#c465c9] p-2 border transition-all duration-500"
            onClick={handleSubmit}
          >
            {" "}
            {editEnabled ? "Edit Transaction" : "Add Transaction"}{" "}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TransactionForm;
