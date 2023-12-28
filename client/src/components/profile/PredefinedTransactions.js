import React, { useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
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
      <div className={`form-container absolute z-10 w-full h-full flex justify-center items-center ${formVisible ? "pointer-events-auto" : "pointer-events-none"} ${formVisible ? "opacity-1" : "opacity-0"} transition-opacity duration-1000`}>
        {/* Main Form */}
        <form className='form relative bg-slate-200 w-[34.5rem] h-[25.25rem] flex py-10 px-8 font-[Inter]'>
          <button className='close-button absolute top-2 right-2 text-3xl' onClick={ (e) => handleCloseClick(e) }>
           <RxCross2/>
          </button>

          {/* Left side of the form */}
          <div className="form-left w-[50%] flex flex-col">
            <div className="transaction-type h-[33.33%]">
              <p className="font-semibold">Transaction Type</p>
              <div>
                <input
                  type="radio"
                  name="transactionType"
                  value="Income"
                  id="income"
                  className="mr-2 appearance-none w-3 h-3 bg-slate-300 rounded-full checked:bg-[#079DF2]"
                />
                <label htmlFor="income">Income</label>
              </div>
              <div>
                <input
                  type="radio"
                  name="transactionType"
                  value="Expense"
                  id="expense"
                  className="mr-2 appearance-none w-3 h-3 bg-slate-300 rounded-full checked:bg-[#079DF2]"
                  defaultChecked
                />
                <label htmlFor="expense">Expense</label>
              </div>
            </div>
            <div className="category-type h-[33.33%]">
              <label htmlFor="category" className="block font-semibold">Category</label>
              <div className="w-[10.25rem] h-[2.2rem] relative">
                <select name='' id='' className="w-[100%] h-[100%] border border-[#6E9DF7] border-opacity-50 appearance-none px-2 bg-white">
                  <option value="food">Food</option>
                  <option value="travel">Travel</option>
                  <option value="shopping">Shopping</option>
                  <option value="bills">Bills</option>
                  <option value="others">Others</option>
                </select>
                <span className="absolute h-[100%] top-[2px] right-1 pointer-events-none">
                  <IoIosArrowUp/>
                  <IoIosArrowDown/>
                </span>
              </div>
            </div>
            <div className="date h-[33.33%]">
              <label htmlFor="date" className="block font-semibold">Date</label>
              <input
                type="date"
                name=""
                id="transaction-date"
                className="w-[10.25rem] h-[2.2rem] border border-[#6E9DF7] border-opacity-50 px-2"/>
            </div>
          </div>

          {/* Right side of the form */}
          <div className="form-right w-[50%] flex flex-col">
            <div className="amount h-[33.33%]">
              <label htmlFor="amount" className="block font-semibold">Amount</label>
              <input type="number" name='' id="amount" className="w-[10.25rem] h-[2.2rem] border border-[#6E9DF7] border-opacity-50 px-2 appearance-none"/>
            </div>
            <div className="description h-[33.33%]">
              <label htmlFor="description" className="block font-semibold">Description</label>
              <input type="text" name="" id="description" className="w-[10.25rem] h-[2.2rem] border border-[#6E9DF7] border-opacity-50 px-2"/>
            </div>
            <div className="h-[33.33%]">
              <button className="w-[10.25rem] h-[2.2rem] bg-[#6E9DF7] bg-opacity-80 font-bold mt-6">Add Transaction</button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default PredefinedTransactions;
