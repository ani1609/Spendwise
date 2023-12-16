import '../index.css';
import '../styles/TransactionsForm.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { addDoc, query, where, onSnapshot, orderBy, updateDoc, getDocs, deleteDoc} from 'firebase/firestore';
import { transactionsCollection } from '../firebaseConfig';


function TransactionsForm(props)
{
    const {user, formData,  setFormData, editEnabled, setEditEnabled} = props;

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

    const handleChange = (e) => 
    {
        const targetValue = e.target.name === 'amount' ? parseFloat(e.target.value) : e.target.value;
        setFormData({ ...formData, [e.target.name]: targetValue });
    };

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
                console.log(error);
                toast.error('Error adding transaction.');
            }
        }
    };

    const newTransaction = () => {
        setEditEnabled(false)
        let addedTransaction={transactionType:'',category:'',date:'',description:'',amount:''}
        setFormData(addedTransaction)
    }



    return(
        <div className="form_container border-2 rounded flex flex-col justify-between">
            <div className="flex flex-row items-start gap-5">
            {
                editEnabled
                    ?
                    <>
                        <h4 className="font-bold text-lg">Edit transaction</h4>
                        <button type="button" class="text-white hover:text-gray-500 hover:bg-white bg-[#c465c9] border-[#c465c9] py-1 px-4 border transition-all duration-500 " onClick={()=>newTransaction()} >New</button>
                    </>
                    :
                    <>
                        <h4 className="font-bold text-lg">Add new transaction</h4>
                    </>
                    
            }
            </div>
            
            
            <form className="flex justify-between" style={{width: "100%"}}>
                <div className="flex flex-col justify-start" style={{width: "45%"}}>
                    <div className="flex flex-col" style={{width: "100%"}}>
                        <legend>Transaction Type</legend>
                        <label style={{ cursor: 'pointer' }}>
                            <input
                                type="radio"
                                name="transactionType"
                                value="Income"
                                id="contactChoice1"
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
                                id="contactChoice2"
                                value="Expense"
                                checked={formData.transactionType === "Expense"}
                                onChange={handleChange}
                                required
                                className="cursor-pointer"
                            />&nbsp;
                            Expense
                        </label>
                    </div>
                    <div className="flex flex-col" style={{marginTop: "25px", width: "100%"}}>
                        <label htmlFor="category">Category</label>
                        <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                            style={{ cursor: formData.transactionType === "Income" ? "not-allowed" : "pointer" }}
                            disabled={formData.transactionType === "Income"}
                            className=" border-2 border-slate-500  rounded-md  sm:px-1 col-md-4"
                            placeholder="Category"
                        >
                            <option value="" hidden>Choose category</option>
                            <option value="Food">Food</option>
                            <option value="Travel">Travel</option>
                            <option value="Shopping">Shopping</option>
                            <option value="Bills">Bills</option>
                            <option value="Others">Others</option>
                        </select>
                    </div>
                    <div className="flex flex-col" style={{marginTop: "25px", width: "100%"}}>
                        <label htmlFor="date">Date</label>
                        <input
                            type="date"
                            name="date"
                            id="date"
                            value={formData.date}
                            onChange={handleChange}
                            placeholder="Date"
                            required
                            className="cursor-pointer border-2  rounded-md bg-transparent h-7 px-1 col-md-4"
                        />
                    </div>
                </div>

                <div className="flex flex-col justify-start" style={{width: "45%"}}>
                    <div className="flex flex-col" style={{width: "100%"}}>
                        <label htmlFor="amount">Amount</label>
                        <input
                            type="number"
                            name="amount"
                            id="number"
                            value={formData.amount}
                            onChange={handleChange}
                            placeholder="Amount"
                            required
                            className="border-2 p-2"
                        />
                    </div>
                    <div className="flex flex-col" style={{marginTop: "29px", width: "100%"}}>
                        <label htmlFor="description">Description</label>
                        <input
                            type="text"
                            id="text"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Description"
                            required
                            className="border-2 p-2"
                            autoComplete="off"
                        />
                    </div>
                    <button type="submit" className="text-white hover:text-gray-500 hover:bg-white border-[#c465c9] border transition-all duration-500" onClick={handleSubmit} style={{marginTop: "49px"}}> {editEnabled ? "Edit Transaction" : "Add Transaction"} </button>
                </div>
            </form>
            <ToastContainer />
        </div>
    );
}


export default TransactionsForm;