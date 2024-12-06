import React, { useState, useEffect } from 'react';
import { MDBBtn, MDBContainer, MDBTypography, MDBCard, MDBCardBody, MDBTableHead, MDBTable, MDBTableBody, MDBInput, MDBCardTitle } from 'mdb-react-ui-kit';
import Navbar from '../Header/Navbar';
import { db } from '../Services/firebase';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import Footer from '../../components/Footer/Footer';
import '../../App.css';

export default function ListExpenses() {
    const navigate = useNavigate();
    const [expenses, setExpenses] = useState([]);
    const [filteredExpenses, setFilteredExpenses] = useState([]);
    const [hostings, setHostings] = useState([]);
    const [filteredHostings, setFilteredHostings] = useState([]);
    const [filterMonth, setFilterMonth] = useState('');
    const [filterYear, setFilterYear] = useState('');
    const [totalExpenses, setTotalExpenses] = useState(0);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [balance, setBalance] = useState(0);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const expensesCollection = collection(db, 'expenses');
                const expensesSnapshot = await getDocs(expensesCollection);
                const expensesList = expensesSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setExpenses(expensesList);
                setFilteredExpenses(expensesList);
            } catch (err) {
                console.error("Erro ao buscar despesas:", err);
                setError("Erro ao buscar despesas. Tente novamente mais tarde.");
            }
        };

        const fetchHostings = async () => {
            try {
                const hostingsCollection = collection(db, 'hosting');
                const hostingsSnapshot = await getDocs(hostingsCollection);
                const hostingsList = hostingsSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setHostings(hostingsList);
                setFilteredHostings(hostingsList);
            } catch (err) {
                console.error("Erro ao buscar hospedagens:", err);
                setError("Erro ao buscar hospedagens. Tente novamente mais tarde.");
            }
        };

        fetchExpenses();
        fetchHostings();
    }, []);

    const formatDate = (timestamp) => {
        if (timestamp && timestamp.toDate) {
            return timestamp.toDate().toLocaleDateString(); // Formata para uma string de data legível
        }
        return '';
    };

    const handleDelete = async (id) => {
        try {
            await deleteDoc(doc(db, 'expenses', id));
            const updatedExpenses = expenses.filter(expense => expense.id !== id);
            setExpenses(updatedExpenses);
            handleFilterChange(); // Chama a função de filtro diretamente após deletar
        } catch (err) {
            console.error("Erro ao deletar despesa:", err);
            setError("Erro ao deletar despesa. Tente novamente mais tarde.");
        }
    };

    const handleFilterChange = () => {
        if (filterMonth && filterYear) {
            const filteredExpenses = expenses.filter(expense => {
                const date = expense.expenseDate.toDate();
                return (
                    date.getMonth() + 1 === parseInt(filterMonth) &&
                    date.getFullYear() === parseInt(filterYear)
                );
            });
            const filteredHostings = hostings.filter(hosting => {
                const date = hosting.dateCheckin.toDate();
                return (
                    date.getMonth() + 1 === parseInt(filterMonth) &&
                    date.getFullYear() === parseInt(filterYear)
                );
            });
            setFilteredExpenses(filteredExpenses);
            setFilteredHostings(filteredHostings);
            calculateTotals(filteredExpenses, filteredHostings);
        } else {
            setFilteredExpenses(expenses);
            setFilteredHostings(hostings);
            calculateTotals(expenses, hostings);
        }
    };

    const calculateTotals = (expensesList, hostingsList) => {
        const totalExpensesValue = expensesList.reduce((sum, expense) => sum + (expense.value || 0), 0);
        const totalRevenueValue = hostingsList.reduce((sum, hosting) => sum + (Number(hosting.total) || 0), 0);
        setTotalExpenses(totalExpensesValue);
        setTotalRevenue(totalRevenueValue);
        setBalance(totalRevenueValue - totalExpensesValue);
    };

    return (
        <>
            <Navbar />
            <div className="main-content">
                <MDBContainer className="text-center py-5">
                    <MDBTypography tag="h1" className="display-4 text-primary">
                        Gerenciamento de Hospedagem
                    </MDBTypography>
                    <MDBTypography tag="p" className="lead">
                        Relatório de despesas e receitas
                    </MDBTypography>
                </MDBContainer>

                {error && <p className="text-danger">{error}</p>}

                <MDBContainer className="mb-4">
                    <MDBCard>
                        <MDBCardBody>
                            <MDBInput
                                label="Mês (1-12)"
                                type="number"
                                min="1"
                                max="12"
                                value={filterMonth}
                                onChange={(e) => setFilterMonth(e.target.value)}
                                className="mb-3"
                            />
                            <MDBInput
                                label="Ano (ex: 2024)"
                                type="number"
                                value={filterYear}
                                onChange={(e) => setFilterYear(e.target.value)}
                                className="mb-3"
                            />
                            <MDBBtn onClick={handleFilterChange}>Filtrar</MDBBtn>
                        </MDBCardBody>
                    </MDBCard>
                </MDBContainer>

                <MDBContainer>
                    <div className="table-responsive">
                        <MDBTable>
                            <MDBTableHead light>
                                <tr>
                                    <th scope="col">Data da Despesa</th>
                                    <th scope="col">Nome da Despesa</th>
                                    <th scope="col">Valor</th>
                                    <th scope="col">Ações</th>
                                </tr>
                            </MDBTableHead>
                            <MDBTableBody>
                                {filteredExpenses.map((expense) => (
                                    <tr key={expense.id}>
                                        <td>{formatDate(expense.expenseDate)}</td>
                                        <td>{expense.expenseName}</td>
                                        <td>R$ {expense.value.toFixed(2)}</td>
                                        <td>
                                            <MDBBtn onClick={() => navigate(`/editExpense/${expense.id}`)}>Editar</MDBBtn>
                                            <MDBBtn color="danger" className="ms-2" onClick={() => handleDelete(expense.id)}>Deletar</MDBBtn>
                                        </td>
                                    </tr>
                                ))}
                            </MDBTableBody>
                        </MDBTable>
                    </div>
                    <MDBContainer className="d-flex justify-content-around mt-4">
                        <MDBCard className="text-center" style={{ width: '300px' }}>
                            <MDBCardBody className="custom-card">
                                <MDBCardTitle><b>Receitas Totais</b></MDBCardTitle>
                                <MDBTypography tag="h5" className="mt-3">
                                    R$ {totalRevenue.toFixed(2)}
                                </MDBTypography>
                            </MDBCardBody>
                        </MDBCard>
                        <MDBCard className="text-center" style={{ width: '300px' }}>
                            <MDBCardBody className="custom-card">
                                <MDBCardTitle><b>Despesas Totais</b></MDBCardTitle>
                                <MDBTypography tag="h5" className="mt-3">
                                    R$ {totalExpenses.toFixed(2)}
                                </MDBTypography>
                            </MDBCardBody>
                        </MDBCard>
                        <MDBCard className="text-center" style={{ width: '300px' }}>
                            <MDBCardBody className="custom-card">
                                <MDBCardTitle><b>Balanço</b></MDBCardTitle>
                                <MDBTypography tag="h5" className="mt-3">
                                    R$ {balance.toFixed(2)}
                                </MDBTypography>
                            </MDBCardBody>
                        </MDBCard>
                    </MDBContainer>
                </MDBContainer>
            </div><br />
            <Footer />
        </>
    );
}
