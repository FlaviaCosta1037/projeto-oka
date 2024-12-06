import React, { useState, useEffect } from 'react';
import { MDBTable, MDBTableHead, MDBTableBody, MDBBtn, MDBContainer, MDBTypography, MDBCard, MDBCardBody, MDBInput, MDBCardTitle } from 'mdb-react-ui-kit';
import Navbar from '../Header/Navbar';
import { db } from '../Services/firebase';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import Footer from '../../components/Footer/Footer';
import '../../App.css'

export default function ListHosting() {
    const navigate = useNavigate();
    const [hostings, setHosting] = useState([]);
    const [filteredHosting, setFilteredHostings] = useState([]);
    const [filterMonth, setFilterMonth] = useState('');
    const [filterYear, setFilterYear] = useState('');
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHosting = async () => {
            try {
                const hostingCollection = collection(db, 'hosting');
                const guestSnapshot = await getDocs(hostingCollection);
                const hostingList = guestSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setHosting(hostingList);
                setFilteredHostings(hostingList);
            } catch (err) {
                console.error("Erro ao buscar hospedagens:", err);
                setError("Erro ao buscar hospedagens. Tente novamente mais tarde.");
            }
        };
        fetchHosting();
    }, []);

    const handleDelete = async (id) => {
        try {
            await deleteDoc(doc(db, 'hosting', id));
            setHosting((prevHosting) => prevHosting.filter((item) => item.id !== id));
            setFilteredHostings((prevFiltered) => prevFiltered.filter((item) => item.id !== id));
            alert('Registro deletado com sucesso!');
        } catch (err) {
            console.error("Erro ao deletar registro:", err);
            alert('Erro ao deletar o registro. Tente novamente.');
        }
    };

    const formatDate = (timestamp) => {
        if (timestamp && timestamp.toDate) {
            return timestamp.toDate().toLocaleDateString('pt-BR');
        }
        return '';
    };

    const handleFilterChange = () => {
        if (filterMonth && filterYear) {
            const filtered = hostings.filter(hosting => {
                const date = hosting.dateCheckin.toDate();
                return (
                    date.getMonth() + 1 === parseInt(filterMonth) &&
                    date.getFullYear() === parseInt(filterYear)
                );
            });
            setFilteredHostings(filtered);
            calculateTotalRevenue(filtered);
        } else {
            setFilteredHostings(hostings);
            calculateTotalRevenue(hostings);
        }
    };

    const calculateTotalRevenue = (hostingList) => {
        const total = hostingList.reduce((sum, hosting) => {

            const hostingTotal = Number(hosting.total) || 0;
            return sum + hostingTotal;
        }, 0);
        setTotalRevenue(total);
    };


    return (
        <>
            <Navbar />
            <div className="main-content">
                <MDBContainer className="my-5">
                    <MDBTypography tag="h1" className="display-4 text-primary text-center">
                        Gerenciamento de Hospedagem
                    </MDBTypography>
                    <MDBTypography tag="p" className="lead text-center">
                        Relatório de reservas
                    </MDBTypography>

                    {error && <p className="text-danger text-center">{error}</p>}
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
                    <div className="table-responsive">
                        <MDBTable bordered>
                            <MDBTableHead>
                                <tr>
                                    <th scope="col">Check-in</th>
                                    <th scope="col">Check-out</th>
                                    <th scope="col">Diárias</th>
                                    <th scope="col">Valor Unitário</th>
                                    <th scope="col">Taxa</th>
                                    <th scope="col">Valor Total</th>
                                    <th scope="col">Ações</th>
                                </tr>
                            </MDBTableHead>
                            <MDBTableBody>
                                {filteredHosting.map((item) => (
                                    <tr key={item.id}>
                                        <td>{formatDate(item.dateCheckin)}</td>
                                        <td>{formatDate(item.dateCheckout)}</td>
                                        <td>{item.numberOfDays}</td>
                                        <td>{item.dailyRate}</td>
                                        <td>{item.platformFee}</td>
                                        <td>{item.total}</td>
                                        <td>
                                            <div className="flex flex-wrap justify-content-center">
                                                <MDBBtn color="primary" onClick={() => navigate(`/editHosting/${item.id}`, { state: { customerCPF: item.customerCPF, customerName: item.customerName } })}>
                                                    Editar
                                                </MDBBtn>
                                                <MDBBtn color="danger" className="ms-2" onClick={() => handleDelete(item.id)}>
                                                    Deletar
                                                </MDBBtn>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </MDBTableBody>
                        </MDBTable>
                    </div>
                    <MDBContainer className="d-flex justify-content-center mt-4">
                        <MDBCard className="text-center" style={{ width: '300px'}}>
                            <MDBCardBody className='custom-card'>
                                <MDBCardTitle><b>Receita Total</b></MDBCardTitle>
                                <MDBTypography tag="h5" className="mt-3">
                                    R$ {Number(totalRevenue).toFixed(2)}
                                </MDBTypography>
                            </MDBCardBody>
                        </MDBCard>
                    </MDBContainer><br />
                </MDBContainer>
            </div>
            <Footer />
        </>
    );
}
