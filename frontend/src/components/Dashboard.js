//components/Dashboard.js
/**
 * File name: Dashboard.js
 * Description: This component represents the Dashboard page of the application. It fetches and displays user transactions, balance information, and visualizes data with charts.
 *              It also includes navigation buttons for profile, adding transactions, goals, and forecasts.
 
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TransactionList from './TransactionList';
import './Dashboard.css';
import { Button, Card, CardContent, Typography, Grid, AppBar, Toolbar, IconButton, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AccountCircle from '@mui/icons-material/AccountCircle';
import ForecastIcon from '@mui/icons-material/WbSunny';
import GoalIcon from '@mui/icons-material/EmojiEvents';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import BalanceIcon from '@mui/icons-material/AccountBalance';
import ExpenseIcon from '@mui/icons-material/ArrowDownward';
import ProfitIcon from '@mui/icons-material/ArrowUpward';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const Dashboard = () => {
    // State hooks for transactions, balance, totals, chart data, and visibility of transactions
    const [transactions, setTransactions] = useState([]);
    const [balance, setBalance] = useState(0);
    const [totalExpense, setTotalExpense] = useState(0);
    const [totalProfit, setTotalProfit] = useState(0);
    const [timeframe, setTimeframe] = useState('weekly');
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});
    const [visibleTransactions, setVisibleTransactions] = useState(12); // Define the state for visible transactions
    const navigate = useNavigate();
    // Fetch transactions and balance on component mount
    useEffect(() => {
        fetchTransactions();
        fetchBalance();
    }, []);
    // Calculate totals and generate chart data whenever transactions or timeframe change
    useEffect(() => {
        calculateTotals();
        generateChartData();
    }, [transactions, timeframe]);
    // Function to fetch transactions from the API
    const fetchTransactions = async () => {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        try {
            const response = await fetch(`http://localhost:3000/api/transactions?userId=${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setTransactions(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching transactions:', error);
            setTransactions([]);
        }
    };
    // Function to fetch balance from the API
    const fetchBalance = async () => {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        try {
            const response = await fetch(`http://localhost:3000/api/users/${userId}/balance`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log('Balance fetched from API:', data.balance); // Add logging
            setBalance(data.balance);
        } catch (error) {
            console.error('Error fetching balance:', error);
            setBalance(0);
        }
    };
    // Function to calculate total expense and profit from transactions
    const calculateTotals = () => {
        let expense = 0;
        let profit = 0;

        transactions.forEach(transaction => {
            if (transaction.categoryId && transaction.categoryId.name && transaction.categoryId.name.toLowerCase() === 'income') {
                profit += parseFloat(transaction.amount);
            } else if (transaction.categoryId && transaction.categoryId.name && transaction.categoryId.name.toLowerCase() === 'expense') {
                expense += parseFloat(transaction.amount);
            }
        });

        setTotalExpense(expense);
        setTotalProfit(profit);
    };
    // Function to generate chart data based on the timeframe
    const generateChartData = () => {
        if (!transactions || transactions.length === 0) {
            setChartData({});
            return;
        }

        let labels = [];
        let incomeData = [];
        let expenseData = [];
        let label = '';
        // Generate data based on timeframe selection
        switch (timeframe) {
            case 'weekly':
                label = 'Weekly Expenses & Income';
                labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
                incomeData = transactions.reduce((acc, transaction) => {
                    const week = Math.ceil(new Date(transaction.date).getDate() / 7);
                    if (transaction.categoryId && transaction.categoryId.name.toLowerCase() === 'income') {
                        if (!acc[week - 1]) {
                            acc[week - 1] = 0;
                        }
                        acc[week - 1] += parseFloat(transaction.amount);
                    }
                    return acc;
                }, new Array(4).fill(0));
                expenseData = transactions.reduce((acc, transaction) => {
                    const week = Math.ceil(new Date(transaction.date).getDate() / 7);
                    if (transaction.categoryId && transaction.categoryId.name.toLowerCase() === 'expense') {
                        if (!acc[week - 1]) {
                            acc[week - 1] = 0;
                        }
                        acc[week - 1] += parseFloat(transaction.amount);
                    }
                    return acc;
                }, new Array(4).fill(0));
                break;
            case 'monthly':
                label = 'Monthly Expenses & Income';
                labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                incomeData = transactions.reduce((acc, transaction) => {
                    const month = new Date(transaction.date).getMonth();
                    if (transaction.categoryId && transaction.categoryId.name.toLowerCase() === 'income') {
                        if (!acc[month]) {
                            acc[month] = 0;
                        }
                        acc[month] += parseFloat(transaction.amount);
                    }
                    return acc;
                }, new Array(12).fill(0));
                expenseData = transactions.reduce((acc, transaction) => {
                    const month = new Date(transaction.date).getMonth();
                    if (transaction.categoryId && transaction.categoryId.name.toLowerCase() === 'expense') {
                        if (!acc[month]) {
                            acc[month] = 0;
                        }
                        acc[month] += parseFloat(transaction.amount);
                    }
                    return acc;
                }, new Array(12).fill(0));
                break;
            case 'yearly':
                label = 'Yearly Expenses & Income';
                const currentYear = new Date().getFullYear();
                labels = [currentYear - 2, currentYear - 1, currentYear];
                incomeData = transactions.reduce((acc, transaction) => {
                    const year = new Date(transaction.date).getFullYear();
                    const index = labels.indexOf(year);
                    if (transaction.categoryId && transaction.categoryId.name.toLowerCase() === 'income' && index >= 0) {
                        if (!acc[index]) {
                            acc[index] = 0;
                        }
                        acc[index] += parseFloat(transaction.amount);
                    }
                    return acc;
                }, new Array(3).fill(0));
                expenseData = transactions.reduce((acc, transaction) => {
                    const year = new Date(transaction.date).getFullYear();
                    const index = labels.indexOf(year);
                    if (transaction.categoryId && transaction.categoryId.name.toLowerCase() === 'expense' && index >= 0) {
                        if (!acc[index]) {
                            acc[index] = 0;
                        }
                        acc[index] += parseFloat(transaction.amount);
                    }
                    return acc;
                }, new Array(3).fill(0));
                break;
            default:
                break;
        }
         // Set chart data and options
        setChartData({
            labels,
            datasets: [
                {
                    label: 'Income',
                    data: incomeData,
                    borderColor: '#4caf50',
                    backgroundColor: 'rgba(76, 175, 80, 0.4)',
                    fill: true,
                    tension: 0.4,
                },
                {
                    label: 'Expenses',
                    data: expenseData,
                    borderColor: '#f44336',
                    backgroundColor: 'rgba(244, 67, 54, 0.4)',
                    fill: true,
                    tension: 0.4,
                },
            ],
        });

        setChartOptions({
            responsive: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            return `${context.dataset.label}: $${context.raw.toFixed(2)}`;
                        },
                    },
                },
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Time Period',
                    },
                },
                y: {
                    title: {
                        display: true,
                        text: 'Amount ($)',
                    },
                    beginAtZero: true,
                },
            },
        });
    };
    //function to delete transaction
    const deleteTransaction = async (id) => {
        if (window.confirm("Are you sure you want to delete this transaction?")) {
            const token = localStorage.getItem('token');
            try {
                const response = await fetch(`http://localhost:3000/api/transactions/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                setTransactions(transactions.filter((t) => t._id !== id));
                fetchBalance(); // Update balance after deletion
            } catch (error) {
                console.error('Error deleting transaction:', error);
            }
        }
    };
    // Function to handle Edit
    const handleEdit = (transaction) => {
        navigate('/add-transaction', { state: { transaction } });
    };
    // Function to handle Profile
    const handleProfile = () => {
        navigate('/profile');
    };
    // Function to handle Add
    const handleAdd = () => {
        navigate('/add-transaction');
    };
    // Function to handle Forecast
    const handleForecast = () => {
        navigate('/forecast');
    };
    // Function to handle add goal
    const handleAddGoal = () => {
        navigate('/add-goal');
    };
    // Function to handle Logout
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        navigate('/login', { replace: true });
    };
    // Function to handle timeframe selection change
    const handleTimeframeChange = (event) => {
        setTimeframe(event.target.value);
    };
    // Function to handle "View More Transactions" button click
    const loadMoreTransactions = () => {
        setVisibleTransactions(prev => prev + 12); // Increase the visible transactions by 12
    };

    return (
        <div className="dashboard-container">
            <video autoPlay loop muted className="background-video">
                <source src="dashboard_background_gif.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            <AppBar position="static" color="primary" className="app-bar">
                <Toolbar>
                    <Typography variant="h6" className="title">
                        Dashboard
                    </Typography>
                    <IconButton color="inherit" onClick={handleProfile}>
                        <AccountCircle />
                    </IconButton>
                    <IconButton color="inherit" onClick={handleLogout}>
                        <ExitToAppIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <div className="dashboard-content">
                <div className="balance-card">
                    <div className="balance-item current-balance">
                        <Typography variant="h6">Current Balance</Typography>
                        <Typography variant="h5" className="balance-amount">
                            <BalanceIcon /> <span>${balance.toFixed(2)}</span>
                        </Typography>
                    </div>
                    <div className="balance-item expense">
                        <Typography variant="h6">Total Expense</Typography>
                        <Typography variant="h5" className="balance-amount">
                            <ExpenseIcon /> <span>${totalExpense.toFixed(2)}</span>
                        </Typography>
                    </div>
                    <div className="balance-item profit">
                        <Typography variant="h6">Total Profit</Typography>
                        <Typography variant="h5" className="balance-amount">
                            <ProfitIcon /> <span>${totalProfit.toFixed(2)}</span>
                        </Typography>
                    </div>
                </div>
                <Grid container spacing={3} className="dashboard-cards">
                    <Grid item xs={12} sm={6} md={3}>
                        <Card className="dashboard-card action-card">
                            <CardContent>
                                <Typography variant="h5">Add Expense</Typography>
                                <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleAdd}>
                                    Add
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card className="dashboard-card action-card">
                            <CardContent>
                                <Typography variant="h5">Profile</Typography>
                                <Button variant="contained" color="primary" startIcon={<AccountCircle />} onClick={handleProfile}>
                                    Profile
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card className="dashboard-card action-card">
                            <CardContent>
                                <Typography variant="h5">Savings Goal</Typography>
                                <Button variant="contained" color="primary" startIcon={<GoalIcon />} onClick={handleAddGoal}>
                                    Add Goal
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card className="dashboard-card action-card">
                            <CardContent>
                                <Typography variant="h5">Budget Forecast</Typography>
                                <Button variant="contained" color="primary" startIcon={<ForecastIcon />} onClick={handleForecast}>
                                    Forecast
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12}>
                        {transactions.length > 0 ? (
                            <TransactionList transactions={transactions.slice(0, visibleTransactions)} onEdit={handleEdit} onDelete={deleteTransaction} />
                        ) : (
                            <Typography variant="h6" align="center" className="no-transactions">
                                No transactions found.
                            </Typography>
                        )}
                    </Grid>
                </Grid>
                {visibleTransactions < transactions.length && (
                    <Grid className="load-more" container justifyContent="center">
                        <Button variant="contained" color="primary" onClick={loadMoreTransactions}>
                            Load More
                        </Button>
                    </Grid>
                )}
                <div className="visualization-section">
                    <FormControl variant="outlined" className="timeframe-select">
                        <InputLabel>Timeframe</InputLabel>
                        <Select value={timeframe} onChange={handleTimeframeChange} label="Timeframe">
                            <MenuItem value="weekly">Weekly</MenuItem>
                            <MenuItem value="monthly">Monthly</MenuItem>
                            <MenuItem value="yearly">Yearly</MenuItem>
                        </Select>
                    </FormControl>
                    {chartData && chartData.labels && chartData.labels.length > 0 && (
                        <Line data={chartData} options={chartOptions} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
