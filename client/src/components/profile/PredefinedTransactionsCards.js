import React from "react";
import editSmall from "../../icons/edit-small.svg";
import cross from "../../icons/cross.svg";

const PredefinedTransactionsCards = () => {
  return (
    <>
    <ExpenseCard/>
    <IncomeCard/>
    </>
  );
};

export const ExpenseCard = () => {
  return (
        <>
            <div className='w-60 h-64 border-[#9EBEFA] bg-[#9EBEFA] flex flex-col rounded-[3px]'>
            <div className='text-[15px] font-medium text-red-600 bg-[#C2D7FF] w-[15rem] h-[40px] flex items-center justify-between p-2'>
              <p>Expense</p>
              <div className='flex gap-2'>
                <img src={editSmall} className='cursor-pointer'/>
                <img src={cross} className='cursor-pointer'/>
              </div>
            </div>
            <div className='flex flex-col justify-around flex-1 p-2'>
              <div>
                <p className='text-[15px] font-medium text-white'>Rent</p>
                <p className='font-medium text-[19px] text-red-600'>Rs 10000</p>
                <hr />
              </div>
              <div>
                <p className='text-[12px] font-medium text-white'>Category</p>
                <p className='font-medium text-[15px] text-white'>Bill</p>
                <hr />
              </div>
              <div>
                <p className='text-[10px] font-medium text-white'>Date</p>
                <p className='font-medium text-[12px] text-white'>15/03/2024</p>
              </div>
            </div>
          </div>
        </>
  );
};

export const IncomeCard = () => {
  return (
        <>
            <div className='w-60 h-64 border-[#9EBEFA] bg-[#9EBEFA] flex flex-col rounded-[3px]'>
            <div className='text-[15px] font-medium text-green-600 bg-[#C2D7FF] w-[15rem] h-[40px] flex items-center p-2 justify-between'>
              <p>Income</p>
              <div className='flex gap-2'>
                <img src={editSmall} className='cursor-pointer'/>
                <img src={cross} className='cursor-pointer'/>
              </div>
            </div>
            <div className='flex flex-col justify-around flex-1 p-2'>
              <div>
                <p className='text-[15px] font-medium text-white'>Rent</p>
                <p className='font-medium text-[19px] text-green-600'>Rs 20000</p>
                <hr />
              </div>
              <div>
                <p className='text-[12px] font-medium text-white'>Category</p>
                <p className='font-medium text-[15px] text-white'>Food</p>
                <hr />
              </div>
              <div>
                <p className='text-[10px] font-medium text-white'>Date</p>
                <p className='font-medium text-[12px] text-white'>15/03/2024</p>
              </div>
            </div>
          </div>
        </>
  );
};

export default PredefinedTransactionsCards;
