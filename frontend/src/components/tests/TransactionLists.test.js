//components/TransactionLists.test.js
/*
 * File name: TransactionList.test.jsx
 * Description: Unit tests for the TransactionList component.
 * 
 * Tests include:
 * - Rendering of transactions grouped by month and year.
 * - Functionality of the edit and delete buttons, ensuring handlers are called correctly.
 */

import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import TransactionList from '../TransactionList';

// Mock data for transactions
const transactions = [
    {
        _id: '1',
        amount: 200,
        date: '2024-07-01',
        description: 'Groceries',
        categoryId: { name: 'Expense' }
    },
    {
        _id: '2',
        amount: 1500,
        date: '2024-07-05',
        description: 'Salary',
        categoryId: { name: 'Income' }
    }
];

describe('TransactionList', () => {
    it('renders transactions grouped by month and year', () => {
        render(<TransactionList transactions={transactions} />);

        // Check if the transactions are rendered correctly
        expect(screen.getByText('July 2024')).toBeInTheDocument();
        expect(screen.getByText('$200')).toBeInTheDocument();
        expect(screen.getByText('Groceries')).toBeInTheDocument();
        expect(screen.getByText('Expense')).toBeInTheDocument();
        expect(screen.getByText('$1500')).toBeInTheDocument();
        expect(screen.getByText('Salary')).toBeInTheDocument();
        expect(screen.getByText('Income')).toBeInTheDocument();
    });

    it('calls onEdit and onDelete handlers when respective buttons are clicked', () => {
        const onEdit = jest.fn();
        const onDelete = jest.fn();

        render(<TransactionList transactions={transactions} onEdit={onEdit} onDelete={onDelete} />);

        // Simulate clicks on edit and delete buttons
        fireEvent.click(screen.getByTestId('edit-button-1'));
        fireEvent.click(screen.getByTestId('delete-button-1'));

        // Check if the handlers are called
        expect(onEdit).toHaveBeenCalledWith(transactions[0]);
        expect(onDelete).toHaveBeenCalledWith(transactions[0]._id);
    });
});


// Test Case For a Failed TransactionList.test.js

/*
 * File name: TransactionList.test.jsx
 * Description: Unit tests for the TransactionList component.
 * 
 * Tests include:
 * - Rendering of transactions grouped by month and year.
 * - Functionality of the edit and delete buttons, ensuring handlers are called correctly.
 */

// import '@testing-library/jest-dom';
// import { render, screen, fireEvent } from '@testing-library/react';
// import TransactionList from '../TransactionList';

// // Mock data for transactions
// const transactions = [
//     {
//         _id: '1',
//         amount: 2000, // Incorrect amount
//         date: '2024-06-01', // Incorrect date
//         description: 'Rent', // Incorrect description
//         categoryId: { name: 'Saving' } // Incorrect category
//     },
//     {
//         _id: '2',
//         amount: 500, // Incorrect amount
//         date: '2024-06-05', // Incorrect date
//         description: 'Freelance', // Incorrect description
//         categoryId: { name: 'Expense' } // Incorrect category
//     }
// ];

// describe('TransactionList', () => {
//     it('renders transactions grouped by month and year', () => {
//         render(<TransactionList transactions={transactions} />);

//         // Change expected text to cause the test to fail
//         expect(screen.getByText('August 2024')).toBeInTheDocument(); // Incorrect month
//         expect(screen.getByText('$300')).toBeInTheDocument(); // Incorrect amount
//         expect(screen.getByText('Rent')).toBeInTheDocument(); // Incorrect description
//         expect(screen.getByText('Saving')).toBeInTheDocument(); // Incorrect category
//     });

//     it('calls onEdit and onDelete handlers when respective buttons are clicked', () => {
//         const onEdit = jest.fn();
//         const onDelete = jest.fn();

//         render(<TransactionList transactions={transactions} onEdit={onEdit} onDelete={onDelete} />);

//         // Simulate clicks on edit and delete buttons
//         fireEvent.click(screen.getByTestId('edit-button-1'));
//         fireEvent.click(screen.getByTestId('delete-button-1'));

//         // Change the expected arguments to cause the test to fail
//         expect(onEdit).toHaveBeenCalledWith(transactions[1]); // Incorrect transaction
//         expect(onDelete).toHaveBeenCalledWith('3'); // Incorrect ID
//     });
// });

