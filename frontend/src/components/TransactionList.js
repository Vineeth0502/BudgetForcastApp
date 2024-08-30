//components/TransactionList.js
/*
 * File name: TransactionList.js
 * Description: This component displays a list of transactions grouped by month.
 * It provides functionality to view, edit, and delete transactions.
 * 
 */

import React, { useState } from 'react';
import { Card, CardContent, Typography, IconButton, Grid , Button} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'; // Profit icon
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'; // Expense icon
import DateRangeIcon from '@mui/icons-material/DateRange';
import DescriptionIcon from '@mui/icons-material/Description';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import './TransactionList.css';

const groupTransactionsByMonth = (transactions) => {
    return transactions.reduce((groups, transaction) => {
        const date = new Date(transaction.date);
        const monthYear = `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
        if (!groups[monthYear]) {
            groups[monthYear] = [];
        }
        groups[monthYear].push(transaction);
        return groups;
    }, {});
};

const TransactionList = ({ transactions, onEdit, onDelete }) => {
    const [visibleTransactions, setVisibleTransactions] = useState(12); // State to manage the number of visible transactions

    const groupedTransactions = groupTransactionsByMonth(transactions);


    const loadMoreTransactions = () => {
        setVisibleTransactions(prev => prev + 12); // Increase the visible transactions by 12
    };

    return (
        <div className="transaction-list-container">
            {Object.keys(groupedTransactions).map((monthYear) => (
                <div key={monthYear} className="transaction-group">
                    <Typography variant="h6" className="transaction-group-header">
                        {monthYear}
                    </Typography>
                    <div className="transaction-group-content">
                        {groupedTransactions[monthYear]
                            .slice(0, visibleTransactions)
                            .map((transaction) => (
                                <Card key={transaction._id} className="transaction-list-item">
                                    <CardContent>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} sm={6} md={3}>
                                                <Typography className="transaction-amount">
                                                    <AttachMoneyIcon className="transaction-icon" />
                                                    ${transaction.amount}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={3}>
                                                <Typography className="transaction-date">
                                                    <DateRangeIcon className="transaction-icon" />
                                                    {new Date(transaction.date).toLocaleDateString()}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={3}>
                                                <Typography className="transaction-description">
                                                    <DescriptionIcon className="transaction-icon" />
                                                    {transaction.description}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={2}>
                                                <Typography className={`transaction-category ${transaction.categoryId.name.toLowerCase()}`}>
                                                    {transaction.categoryId.name === 'Income' ? (
                                                        <ArrowUpwardIcon className="transaction-icon" />
                                                    ) : (
                                                        <ArrowDownwardIcon className="transaction-icon" />
                                                    )}
                                                    {transaction.categoryId.name}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={1} className="transaction-actions">
                                                <IconButton
                                                    color="primary"
                                                    onClick={() => onEdit(transaction)}
                                                    data-testid={`edit-button-${transaction._id}`}
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                                <IconButton
                                                    color="secondary"
                                                    onClick={() => onDelete(transaction._id)}
                                                    data-testid={`delete-button-${transaction._id}`}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            ))}
                    </div>
                </div>
            ))}
            {visibleTransactions < transactions.length && (
                <div className="see-more-button-container1">
                    <Button variant="contained" color="primary" onClick={loadMoreTransactions}>
                        Load More
                    </Button>
                </div>
            )}
        </div>
    );
};

export default TransactionList;
