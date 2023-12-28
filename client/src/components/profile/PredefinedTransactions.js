import React, { useState } from "react";
import { RxCross2 } from "react-icons/rx";
import plusFill from "../../icons/ph_plus-fill.svg";
import PredefinedTransactionsCards from "./PredefinedTransactionsCards";

const PredefinedTransactions = () => {
  const dynamicWidth = "calc(100% - 240px)";

  const [formVisible, setFormVisible] = useState(false);

  const handleAddNewTransactions = () => {
    console.log("clicked");
    setFormVisible(true);
  };

  const handleCloseClick = (e) => {
    e.preventDefault();
    console.log("close clicked");
    setFormVisible(false);
  };
  console.log(formVisible);
  return (
    <>
      <div className='relative sm:left-60 -left-0 sm:w-[calc(100%-240px)] w-[100%] pl-2'>
        <div className='font-[Inter] '>
          <h1 className='font-bold text-[#024164] sm:text-xl text-base mb-6 sm:text-left text-center'>
            Predefined Transactions
          </h1>
          <h2 className='font-medium text-[19px] text-[#024164] mb-2 text-center sm:text-left'>
            Income/Expense
          </h2>
          <div className='flex flex-wrap gap-5 sm:justify-start justify-center'>
            <div className='w-60 h-64 border-2 border-[#9EBEFA] flex flex-col justify-center items-center cursor-pointer' onClick={handleAddNewTransactions}>
              <img src={plusFill} alt='' />
              <button className='text-sm font-semibold text-white bg-[#9EBEFA] w-[167px] h-[35px] rounded-xl'>
                Add New Transactions
              </button>
            </div>
            <PredefinedTransactionsCards />
          </div>
        </div>
      </div>
      <div className={`form-container absolute z-10 w-full h-full flex justify-center items-center ${formVisible ? "pointer-events-auto" : "pointer-events-none"} ${formVisible ? "opacity-1" : "opacity-0"}`}>
        {/* Main Form */}
        <form className='form bg-rose-300 w-[34.5rem] h-[25.25rem]'>
          <button className='close-button' onClick={ (e) => handleCloseClick(e) }>
            <RxCross2 />
          </button>

          {/* Left side of the form */}
          <div className="form-left">
            <div className="transaction-type">
              <p>Transaction Type</p>
              <div>
                <input
                  type="radio"
                  name="transactionType"
                  value="Income"
                  id="income"
                />
                <label htmlFor="income">Income</label>
              </div>
              <div>
                <input
                  type="radio"
                  name="transactionType"
                  value="Expense"
                  id="expense"
                  defaultChecked
                />
                <label htmlFor="expense">Expense</label>
              </div>
            </div>
            <div className="category-type">
              <label htmlFor="category">Category</label>
              <select name='' id=''>
                <option value="food">Food</option>
                <option value="food">Travel</option>
                <option value="food">Shopping</option>
                <option value="food">Bills</option>
                <option value="food">Others</option>
              </select>
            </div>
            <div className="date">
              <label htmlFor="date">Date</label>
              <input type="date" name='' id="date" />
            </div>
          </div>

          {/* Right side of the form */}
          <div className="form-right">
            <div className="amount">
              <label htmlFor="amount">Amount</label>
              <input type="number" name='' id="amount" />
            </div>
            <div className="description">
              <label htmlFor="description">Description</label>
              <input type="text" name="" id="description" />
            </div>
            <div>
              <button>Add Transaction</button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default PredefinedTransactions;
