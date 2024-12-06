import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MDBInput, MDBBtn, MDBContainer, MDBTypography, MDBCol, MDBRow } from 'mdb-react-ui-kit';
import Navbar from '../Header/Navbar';
import { db } from '../Services/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import Footer from '../../components/Footer/Footer';
import '../../App.css'

function EditExpense() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [expense, setExpense] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchExpense = async () => {
            try {
                const expenseDoc = doc(db, 'expenses', id);
                const expenseSnapshot = await getDoc(expenseDoc);

                if (expenseSnapshot.exists()) {
                    const data = expenseSnapshot.data();
                    // Verifica se a data é um Timestamp do Firestore e converte para 'YYYY-MM-DD'
                    const formattedDate = data.expenseDate instanceof Date
                        ? data.expenseDate.toISOString().split('T')[0]
                        : ''; // Ajuste para o caso de outros formatos

                    setExpense({
                        expenseDate: formattedDate,
                        expenseName: data.expenseName || '',
                        value: data.value?.toString() || '',
                    });
                } else {
                    setError("Despesa não encontrada.");
                }
            } catch (err) {
                console.error("Erro ao buscar despesa:", err);
                setError("Erro ao buscar despesa. Tente novamente mais tarde.");
            } finally {
                setLoading(false);
            }
        };

        fetchExpense();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setExpense((prevExpense) => ({
            ...prevExpense,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const expenseDoc = doc(db, 'expenses', id);
            await updateDoc(expenseDoc, {
                expenseDate: new Date(expense.expenseDate), // Converte a data para Date
                expenseName: expense.expenseName,
                value: parseFloat(expense.value), // Converte o valor para número
            });
            navigate('/expenses');
        } catch (err) {
            console.error("Erro ao atualizar despesa:", err);
            setError("Erro ao atualizar despesa. Tente novamente mais tarde.");
        }
    };

    if (loading) {
        return <p>Carregando...</p>;
    }

    return (
        <>
            <Navbar />
            <div className="main-content">

                <MDBContainer className="text-center py-5">
                    <MDBTypography tag="h1" className="display-4 text-primary">
                        Gerenciamento de Hospedagem
                    </MDBTypography>
                    <MDBTypography tag="p" className="lead">
                        Edite uma despesa agora!
                    </MDBTypography>
                </MDBContainer>
                {error && <p className="text-danger">{error}</p>}
                <MDBContainer>
                    {expense ? (
                        <form onSubmit={handleSubmit}>
                            <h2>Editar Despesa</h2>
                            <MDBInput
                                label="Data da Despesa"
                                name="expenseDate"
                                type="date"
                                value={expense.expenseDate}
                                onChange={handleChange}
                                required
                                className="mb-3"
                            />
                            <MDBInput
                                label="Descrição"
                                name="expenseName"
                                value={expense.expenseName}
                                onChange={handleChange}
                                required
                                className="mb-3"
                            />
                            <MDBInput
                                label="Valor"
                                name="value"
                                type="number"
                                value={expense.value}
                                onChange={handleChange}
                                required
                                className="mb-3"
                            />
                            <MDBRow className="mt-3">
                                <MDBCol>
                                    <MDBBtn type="submit">Salvar</MDBBtn>
                                </MDBCol>
                                <MDBCol className="text-end">
                                    <MDBBtn color="danger" onClick={() => navigate('/expenses')}>Voltar</MDBBtn>
                                </MDBCol>
                            </MDBRow>
                        </form>
                    ) : (
                        <p>Despesa não encontrada.</p>
                    )}
                </MDBContainer>
            </div><br />
            <Footer></Footer>
        </>

    );
}

export default EditExpense;
