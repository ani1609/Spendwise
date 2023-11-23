import { useState, useEffect } from "react";
import "../styles/App.css";
import Navbar from "./Navbar";
import ExpenseTracker from "./ExpenseTracker";



function App() 
{

    return (
        <div className="App">
            <Navbar/>
            <ExpenseTracker/>
        </div>
    );
}

export default App;
