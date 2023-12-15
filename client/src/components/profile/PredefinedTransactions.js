import React from 'react';
import plusFill from '../../icons/ph_plus-fill.svg';
import PredefinedTransactionsCards from './PredefinedTransactionsCards';

const PredefinedTransactions = () => {
  const dynamicWidth = 'calc(100% - 240px)'

  return (
    <>
      <div className='relative left-60 pl-2' style={{width:dynamicWidth}}>
        <div className='font-[Inter] '>
          <h1 className='font-bold text-[#024164] text-xl mb-6'>
            Predefined Transactions
          </h1>
          <h2 className='font-medium text-[19px] text-[#024164] mb-2 text-center sm:text-left'>
            Income/Expense
          </h2>
          <div className='flex flex-wrap gap-5 justify-start'>
            <div className='w-60 h-64 border-2 border-[#9EBEFA] flex flex-col justify-center items-center'>
              <img src={plusFill} alt='' />
              <button className='text-sm font-semibold text-white bg-[#9EBEFA] w-[167px] h-[35px] rounded-xl'>
                Add New Transactions
              </button>
            </div>
            <PredefinedTransactionsCards />
          </div>
        </div>
      </div>
    </>
  );
};

export default PredefinedTransactions;
