import { useEffect, useLayoutEffect, useState } from "react";
import axios from "axios";
import "../styles/ExpenseTracker.css";
import "../index.css";
import { addDoc, query, where, onSnapshot, orderBy, updateDoc, getDocs, deleteDoc} from 'firebase/firestore';
import { transactionsCollection } from '../firebaseConfig';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ReactComponent as Edit } from '../icons/edit.svg';
import { ReactComponent as Delete } from '../icons/delete.svg';
import { ReactComponent as Food } from '../icons/food.svg';
import { ReactComponent as Travel } from '../icons/travel.svg';
import { ReactComponent as Shopping } from '../icons/shopping.svg';
import { ReactComponent as Bills } from '../icons/bills.svg';
import { ReactComponent as Others } from '../icons/others.svg';
import {ReactComponent as Plus} from '../icons/plus1.svg';
import DoughnutChart from "./DoughnutChart";
import MyLoader from "./TransactionLoading";



function ExpenseTracker() 
{
    const userToken = JSON.parse(localStorage.getItem('expenseTrackerUserToken'));
    const [user, setUser] = useState({});
    const [dateFillter,setDateFilter]=useState('')
    const [transactions, setTransactions] = useState([]);
    const [transactionFilter, setTransactionFilter] = useState([]);
    const [transactionType,setTransactionType]=useState('')
    const [formData, setFormData] = useState({
        email: "",
        transactionType: "",
        category: "",
        date: "",
        amount: "",
        description: "",
        transactionId: ""
    });
    const [balance, setBalance] = useState(0);
    const [incoming, setIncoming] = useState(0);
    const [outgoing, setOutgoing] = useState(0);
    const [editEnabled, setEditEnabled] = useState(false);
    const [transactionsLoading, setTransactionsLoading] = useState(true);
    const [categoryFilter, setCategoryFilter] = useState('');
    const [descriptionChars, setDescriptionChars] = useState(0);
    const [isDropdownOpen, setDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setDropdownOpen(!isDropdownOpen);
      };
    
      const closeDropdown = () => {
        setDropdownOpen(false);
      };

    const fetchDataFromProtectedAPI = async (userToken) => 
    {
        try 
        {
            const config = {
                headers: {
                Authorization: `Bearer ${userToken}`,
                },
            };
            // const response = await axios.get(`${process.env.REACT_APP_SERVER_PORT}/api/user`, config);
            const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/user`, config);
            setUser(response.data.user);
            // console.log(response.data.user);
        }
        catch (error)
        {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() =>
    {
        if (userToken)
        {
            fetchDataFromProtectedAPI(userToken);
        }
    }
    , [userToken]);


    function generateTransactionId()
    {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let transactionId = '';
        for (let i = 0; i < 10; i++) 
        {
            const randomIndex = Math.floor(Math.random() * characters.length);
            transactionId += characters.charAt(randomIndex);
        }
        return transactionId;
    }

    useEffect(() => 
    {
        let incoming = 0;
        let outgoing = 0;
        transactions.forEach(transaction => 
        {
            if (transaction.transactionType === "Income") 
            {
                incoming += transaction.amount;
            }
            else 
            {
                outgoing += transaction.amount;
            }
        });
        setIncoming(incoming);
        setOutgoing(outgoing);
        setBalance(incoming - outgoing);
    }, [transactions]);

    const handleChange = (e) => 
    {
        const targetValue = e.target.name === 'amount' ? parseFloat(e.target.value) : e.target.value;
        setFormData({ ...formData, [e.target.name]: targetValue });
    };

    useEffect(() => 
    {
        if (user && user.email) 
        {
            const q = query(
                transactionsCollection,
                where('email', '==', user.email),
                orderBy('created_at', 'asc') // or 'asc' for ascending order
            );
        
            return onSnapshot(q, (snapshot) => 
            {
                let updatedTransactions = snapshot.docs.map((doc) => doc.data());
                setTransactions(updatedTransactions);
                let transactiontype = localStorage.getItem('transactionType') ? localStorage.getItem('transactionType') : ''
                let datefiter=localStorage.getItem('dateFilter')?localStorage.getItem('dateFilter'):''
               
                if (transactiontype && transactiontype != 'all')
                    updatedTransactions=  updatedTransactions.filter(item => item.transactionType == transactiontype)
                if (categoryFilter && categoryFilter != 'all') {
                    updatedTransactions = updatedTransactions.filter(item => item.category === categoryFilter);
                }
                if (datefiter) {
                    updatedTransactions = updatedTransactions.filter(item => item.date == datefiter) 
                }
                 
                setTransactionFilter(updatedTransactions)
            
                if (transactionsLoading) 
                {
                    setTransactionsLoading(false);
                }
            });
        }
    }, [user, transactionType, categoryFilter, dateFillter]);
    useEffect(() => {
        localStorage.removeItem('transactionType') 
        localStorage.removeItem('dateFilter')
      
    },[])
    const handleSubmit = async (e) => 
    {
        e.preventDefault();
        if (formData.transactionType === "")
        {
            toast.error("Please select a transaction type.");
            return;
        }
        if (formData.transactionType === "Income" && formData.category !== "NULL")
        {
            setFormData({ ...formData, category: "NULL" });
        }
        if (formData.transactionType === "Expense" && formData.category === "")
        {
            toast.error("Please select a category.");
            return;
        }
        if (formData.date === "")
        {
            toast.error("Please select a date.");
            return;
        }
        if (formData.amount === "")
        {
            toast.error("Please enter an amount.");
            return;
        }
        if (formData.description === "")
        {
            toast.error("Please enter a description.");
            return;
        }
        if (editEnabled) 
        {
            console.log("edit clicked ", formData.transactionId);
            try 
            {
                const querySnapshot = await getDocs(
                  query(transactionsCollection, where('transactionId', '==', formData.transactionId))
                );
              
                if (querySnapshot.empty) 
                {
                    toast.error('Transaction not found.');
                } 
                else 
                {
                    const transactionDoc = querySnapshot.docs[0].ref;
                    const transactionObject = 
                    {
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
                        description: ""
                    });
                    setEditEnabled(false);
                    toast.success('Transaction edited successfully.');
                }
            } 
            catch (error) 
            {
                toast.error('Error editing transaction.');
            }
        }
        else 
        {
            try 
            {
                const transactionObject = 
                {   
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
                // console.log('Transaction ID:', newTransactionRef.id);
                setFormData({
                    transactionType: "",
                    category: "",
                    date: "",
                    amount: "",
                    description: ""
                });
                toast.success("Transaction added successfully.");
            } 
            catch (error) 
            {
                toast.error('Error adding transaction.');
            }
        }
    };

    const handleEdit = (transactionId, index) => 
    {
        setEditEnabled(true);

        const editedTransaction = { ...transactions.filter(e=>e.transactionId==transactionId)[0] };
        console.log(editedTransaction,transactions,transactionId)
        const date = new Date(editedTransaction.date);
        const formattedDate = date.toISOString().split('T')[0];
        editedTransaction.date = formattedDate;
        setFormData(editedTransaction);
    }

    const handleDelete = async (transactionId, index) => 
    {
        try 
        {
            const querySnapshot = await getDocs(
                query(transactionsCollection, where('transactionId', '==', transactionId))
            );
            
            if (querySnapshot.empty) 
            {
                toast.error('Transaction not found.');
            }
            else 
            {
                const transactionDoc = querySnapshot.docs[0].ref;
                await deleteDoc(transactionDoc);
                toast.success('Transaction deleted successfully.');
            }
        }
        catch (error) 
        {
            toast.error("Error deleting transaction.");
        }
    }
    const TransactionTypeChange = (e) => {
        if (e.target.value == 'all') {
            let transactionnews = transactions
            if (dateFillter)
            transactionnews = transactionnews.filter(item => item.date == dateFillter)
            setTransactionFilter(transactionnews)
           
        }
          
        else
        {
            let transactionnews = transactions.filter(item => item.transactionType == e.target.value)
            if (dateFillter)
            transactionnews = transactionnews.filter(item => item.date == dateFillter)
            setTransactionFilter(transactionnews)
           
        }
        if (e.target.value) {
            localStorage.setItem('transactionType',e.target.value)
        }
        else  localStorage.removeItem('transactionType')
        setTransactionType(e.target.value)
        setCategoryFilter('');
        closeDropdown();

    }
    const CategoryChange = (e) => {
        setCategoryFilter(e.target.value);
    };
    const newTransaction = () => {
        setEditEnabled(false)
        let addedTransaction={transactionType:'',category:'',date:'',description:'',amount:''}
        setFormData(addedTransaction)
    }
    const changeDateFilter = (e) => {
        if (e.target.value) {
            let transactionsfilter = transactions.filter(item => item.date == e.target.value)
            if (transactionType && transactionType!='all') 
            
                transactionsfilter=  transactionsfilter.filter(item => item.transactionType == transactionType)
                setTransactionFilter(transactionsfilter)
            localStorage.setItem('dateFilter',e.target.value)
        }
        else {
         
            let transactionsfilter=transactions
         
            if (transactionType && transactionType!='all')
                
            transactionsfilter=  transactionsfilter.filter(item => item.transactionType == transactionType)
         
            setTransactionFilter(transactionsfilter)
            localStorage.removeItem('dateFilter')
        }
   
        setDateFilter(e.target.value)
       
    }

    useLayoutEffect(()=>{
        function updateSize() {
            const width = window.innerWidth;
            setDescriptionChars(width <= 320 ? 5 : width <= 375 ? 8 :
                    width <= 480 ? 12 : width <= 768 ? 20 : 22)
        }
        window.addEventListener('resize', updateSize);
        updateSize();
        return () => window.removeEventListener('resize', updateSize);
    }, [])

    return (
        <div className="expenseTracker_parent">
            <div className="balance_container border-2 rounded">
                <h3>Your Balance-</h3>
                <h1>&#x20B9;{balance}</h1>
            </div>
            <div className="formTransactions_container flex justify-evenly">
                <div className="form_container border-2 rounded p-8">
                    <div className="flex flex-row items-start gap-5">
                    {
                        editEnabled
                            ?
                            <>
                                <h4 className="font-bold text-lg mb-10">Edit transaction
                                
                                
                                </h4>
                                <button type="button" class="text-white hover:text-gray-500 hover:bg-white bg-[#c465c9] border-[#c465c9] py-1 px-4 border transition-all duration-500 " onClick={()=>newTransaction()} >New</button>
                            </>
                         
                            : <>
                                <h4 className="font-bold text-lg mb-10">Add new transaction</h4>
                                
                            </>
                         
                    }
                    </div>
                   
                 
                    <form className="flex gap-4">
                        <div className="flex flex-col gap-2">
                            <legend>Transaction Type</legend>
                            <label style={{ cursor: 'pointer' }}>
                                <input
                                    type="radio"
                                    name="transactionType"
                                    value="Income"
                                    checked={formData.transactionType === "Income"}
                                    onChange={handleChange}
                                    required
                                    className="cursor-pointer"
                                />&nbsp;
                                Income
                            </label>
                            <label style={{ cursor: 'pointer' }}>
                                <input
                                    type="radio"
                                    name="transactionType"
                                    value="Expense"
                                    checked={formData.transactionType === "Expense"}
                                    onChange={handleChange}
                                    required
                                    className="cursor-pointer"
                                />&nbsp;
                                Expense
                            </label>
                            <label htmlFor="category" className="mt-4">Category</label>
                            <select
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                                style={{ cursor: formData.transactionType === "Income" ? "not-allowed" : "pointer" }}
                                disabled={formData.transactionType === "Income"}
                                className=" border border-slate-500 rounded-md bg-transparent h-7 sm:px-1 col-md-4"
                            >
                                <option value="NULL">Choose a category</option>
                                <option value="Food">Food</option>
                                <option value="Travel">Travel</option>
                                <option value="Shopping">Shopping</option>
                                <option value="Bills">Bills</option>
                                <option value="Others">Others</option>
                            </select>
                            <label htmlFor="date" className="mt-4">Date</label>
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                placeholder="Date"
                                required
                                className="cursor-pointer border border-slate-500 rounded-md bg-transparent h-7 px-1 col-md-4"
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
                            <label htmlFor="description" className="mt-4">Description</label>
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
                            <button type="submit" className=" mt-4 text-white hover:text-gray-500 hover:bg-white border-[#c465c9] p-2 border transition-all duration-500" onClick={handleSubmit}> {editEnabled ? "Edit Transaction" : "Add Transaction"} </button>
                        </div>
                    </form>
                </div>
            

                <div className="WalletDetails_container flex flex-col">
                    <div className="incomeExpense_container border-2 rounded flex justify-around gap-2">
                        <h3 className="flex flex-col items-center">Income<span className="text-green-600 text-xl">+ &#x20B9;{incoming}</span></h3>
                        <h3 className="flex flex-col items-center">Expense<span className="text-red-600 text-xl">- &#x20B9;{outgoing}</span></h3>
                    </div>
                    <div className="transaction-group row flex flex-col mb-2">
                    <h4 className="font-bold">Transactions</h4>
                    <div className="flex justify-between ">
                    <div className="form-group col-md-4">
                        <div className="custom-dropdown " onBlur={closeDropdown} tabIndex={0}>
                            <div className="selected-value w-20 rounded text-center cursor-pointer border-[1px] border-black"  onClick={toggleDropdown}>
                                {transactionType ? transactionType : 'Type'}<i class="arrow down"></i>
                            </div>
                            {isDropdownOpen && (
                                <div className="options">
                                    <div onClick={() => TransactionTypeChange({ target: { value: 'all' } })} className="option bg-white w-20 text-start px-2 cursor-pointer hover:bg-slate-200">All</div>
                                    <div onClick={() => TransactionTypeChange({ target: { value: 'Income' } })} className="option bg-white w-20 text-start px-2 cursor-pointer hover:bg-slate-200">Income</div>
                                    <div onClick={() => TransactionTypeChange({ target: { value: 'Expense' } })} className="option bg-white w-20 text-start px-2 cursor-pointer hover:bg-slate-200">Expense</div>
                                </div>
                            )}
                        </div>
                    </div>
                        <div>
                            <select id="categoryFilter" className="form-control border border-slate-500 rounded-md bg-transparent h-7 px-1 col-md-4 cursor-pointer" onChange={(e) => CategoryChange(e)} value={categoryFilter}>
                                <option value='' hidden>Category</option>
                                <option value='all'>All</option>
                                <option value='Food'>Food</option>
                                <option value='Travel'>Travel</option>
                                <option value='Shopping'>Shopping</option>
                                <option value='Bills'>Bills</option>
                                <option value='Others'>Others</option>
                            </select>
                        </div>
                        <input
                                type="date"
                                name="date"
                                value={dateFillter}
                                onChange={(e)=>changeDateFilter(e)}
                                placeholder="Date"
                                required
                                className="cursor-pointer max_with border border-slate-500 rounded-md bg-transparent h-7 px-1"
                            />
                        </div>
                    </div>
                
                    
                    
                    <hr></hr>
                    {transactionFilter.length > 0 ? (
                        <ul className="transactions_container flex flex-col gap-2">
                         
                            {transactionFilter.map((transaction, index) => (
                                transaction.transactionType === "Income" ?
                                (   
                                    <li key={index} className="income flex justify-between items-center border-2 rounded p-2">
                                        <div className="icon_container">
                                            <Plus className="icons" />
                                        </div>
                                        <div className="descDate_container">
                                            {transaction.description.length > descriptionChars ? <h4>{transaction.description.substring(0,descriptionChars)+"..."}</h4> : <h4>{transaction.description}</h4>}
                                            <p>{new Date(transaction.date).toLocaleDateString()}</p>
                                        </div>
                                        <h1>+&#x20B9;{transaction.amount}</h1>
                                        <div className="editDelete_container">
                                            <Edit className="edit_icon" onClick={() => handleEdit(transaction.transactionId, index)} />
                                            <Delete className="delete_icon" onClick={() => handleDelete(transaction.transactionId, index)} />
                                        </div>
                                    </li>
                                ) : (
                                    <li key={index} className="outcome flex justify-between items-center border-2 rounded p-2">
                                        <div className="icon_container">
                                            {transaction.category === "Food" ? <Food className="icons" /> : null}
                                            {transaction.category === "Travel" ? <Travel className="icons" /> : null}
                                            {transaction.category === "Shopping" ? <Shopping className="icons" /> : null}
                                            {transaction.category === "Bills" ? <Bills className="icons" /> : null}
                                            {transaction.category === "Others" ? <Others className="icons" /> : null}
                                        </div>
                                        <div className="descDate_container">
                                        {transaction.description.length > descriptionChars ? <h4>{transaction.description.substring(0,descriptionChars)+"..."}</h4> : <h4>{transaction.description}</h4>}
                                            <p>{new Date(transaction.date).toLocaleDateString()}</p>
                                        </div>
                                        <h1>-&#x20B9;{transaction.amount}</h1>
                                        <div className="editDelete_container">
                                            <Edit className="edit_icon" onClick={() => handleEdit(transaction.transactionId, index)} />
                                            <Delete className="delete_icon" onClick={() => handleDelete(transaction.transactionId, index)} />
                                        </div>
                                    </li>
                                )
                            ))}
                        </ul>
                    ) : (
                        transactionsLoading ? <MyLoader/> : <p className="text-gray-400">No transactions added yet.</p>
                    )}
                </div>
            </div>
            {transactions.length > 0 && <DoughnutChart transactions={transactions} />}
            <ToastContainer />
        </div>
    );
}

export default ExpenseTracker;