import './App.css';
import React from 'react';
import Login from "./components/Auth/Login"
import Hosting from './components/Guest/IndexHosting';
import AddCustomer from './components/Person/AddCustomer'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ListCustomer from './components/Person/listCustomer';
import EditCustomer from './components/Person/EditCustomer';
import AddHosting from './components/Guest/AddHosting'
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import EditHosting from './components/Guest/editHosting';
import AddExpense from './components/Expenses/AddExpense';
import ListExpenses from './components/Expenses/ListExpenses';
import EditExpenses from './components/Expenses/EditExpenses';
import ListHosting from './components/Guest/IndexHosting'






function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/hosting" element={<Hosting />} />
        <Route path="/AddCustomer" element={<AddCustomer />} />
        <Route path="/listCustomer" element={<ListCustomer />} />
        <Route path="/customers/:id" element={<EditCustomer />} />
        <Route path="/listHosting" element={<ListHosting />} />
        <Route path="/AddHosting" element={<AddHosting />} />
        <Route path="/editHosting/:id" element={<EditHosting />} />
        <Route path="/AddExpense" element={<AddExpense />} />
        <Route path="/expenses" element={<ListExpenses />} />
        <Route path="/editExpense/:id" element={<EditExpenses />} />
        <Route path="/login" element={<Login />} />
        
      </Routes>
    </Router >
  );
}

export default App;
