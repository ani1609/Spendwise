import React, { useState, useEffect, useContext } from "react";
import Chart from "react-apexcharts";
import { ThemeContext } from "../context/ThemeContext";
import "../styles/DoughnutChart.css";
import "../index.css";

function DoughnutChart (props) {
  const { transactions } = props;
  const [showChart, setShowChart] = useState(false);
  const [foodExpenses, setFoodExpenses] = useState(0);
  const [travelExpenses, setTravelExpenses] = useState(0);
  const [shoppingExpenses, setShoppingExpenses] = useState(0);
  const [billsExpenses, setBillsExpenses] = useState(0);
  const [othersExpenses, setOthersExpenses] = useState(0);
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    if (transactions) {
      let flag = false;
      setFoodExpenses(0);
      setTravelExpenses(0);
      setShoppingExpenses(0);
      setBillsExpenses(0);
      setOthersExpenses(0);

      transactions.forEach((transaction) => {
        if (transaction.transactionType === "Expense") {
          setShowChart(true);
          flag = true;
          switch (transaction.category) {
            case "Food":
              setFoodExpenses((prev) => prev + transaction.amount);
              break;
            case "Travel":
              setTravelExpenses((prev) => prev + transaction.amount);
              break;
            case "Shopping":
              setShoppingExpenses((prev) => prev + transaction.amount);
              break;
            case "Bills":
              setBillsExpenses((prev) => prev + transaction.amount);
              break;
            case "Others":
              setOthersExpenses((prev) => prev + transaction.amount);
              break;
            default:
              break;
          }
        }
      });
      if (!flag) {
        setShowChart(false);
      }
    }
  }, [transactions]);

  return (
        <React.Fragment>
            <div className="chart_container pb-5">
                {showChart
                  ? (<Chart
                    type="donut"
                    width="100%"
                    height="450"

                    series={[foodExpenses, travelExpenses, shoppingExpenses, billsExpenses, othersExpenses]}

                    options={{
                      labels: ["Food", "Travel", "Shopping", "Bills", "Others"],
                      legend: {
                        position: "bottom",
                        labels: {
                          colors: theme === "dark" ? "#B6CEFC80" : "#000"
                        }
                      },

                      stroke: {
                        colors: theme === "dark" ? ["#B6CEFC80"] : ["#fff"]
                      }

                    }}
                >
                </Chart>)
                  : (
                    <p>Add your expenses to see meaningful insights here!</p>
                    )}
            </div>
        </React.Fragment>
  );
}

export default DoughnutChart;
