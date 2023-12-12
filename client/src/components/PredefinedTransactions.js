import React from 'react';
import plusFill from '../icons/ph_plus-fill.svg';
import PredefinedTransactionsCards from './PredefinedTransactionsCards';

const PredefinedTransactions = () => {
  return (
    <>
      <div className='mx-auto w-[90%] font-[Inter]'>
        <h1 className='font-bold text-[#024164] text-xl mb-6'>
          Predefined Transactions
        </h1>
        <h2 className='font-medium text-[19px] text-[#024164] mb-2 text-center sm:text-left'>
          Income/Expense
        </h2>
        <div className='flex flex-wrap gap-6 sm:flex-no-wrap justify-center sm:justify-start'>
          <div className='w-60 h-64 border-2 border-[#9EBEFA] flex flex-col justify-center items-center'>
            <img src={plusFill} alt='' />
            <button className='text-sm font-semibold text-white bg-[#9EBEFA] w-[167px] h-[35px] rounded-xl'>
              Add New Transactions
            </button>
          </div>    
          <PredefinedTransactionsCards/>
        </div>
        </div>
    </>
  );
};

export default PredefinedTransactions;
