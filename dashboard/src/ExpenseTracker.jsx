import React from "react";
import Card from "./Card";
import "./ExpenseTracker.css"

function ExpenseTracker(props)
{   
    return (
        <>
            <div className="expense-tracker-row">
                <Card cardColor="rgb(66,44,88)" upperColor="rgb(36,29,42)" upperText="Today's Consumption" lowerText="Today's Expense" detailsup = {props.details.today.energy} detailsdown={props.details.today.cost}></Card>
                <Card cardColor="rgb(51,66,105)" upperColor="rgb(32,37,48)" upperText="Month's Consumption" lowerText="Month's Expense" detailsup = {props.details.month.energy} detailsdown={props.details.month.cost}></Card>
                <Card cardColor="rgb(51,89,105)" upperColor="rgb(32,44,48)" upperText="Year's Consumption" lowerText="Year's Expense" detailsup = {props.details.year.energy} detailsdown = {props.details.year.cost}></Card>
            </div>
        </>
    )
}

export default ExpenseTracker;