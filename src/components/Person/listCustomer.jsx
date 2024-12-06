import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MDBTable, MDBTableHead, MDBInput, MDBBtn, MDBContainer, MDBTypography, MDBTableBody, MDBCol, MDBRow } from 'mdb-react-ui-kit';
import Navbar from '../Header/Navbar';
import { db } from '../Services/firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import Footer from '../../components/Footer/Footer';
import '../../App.css'

export default function ListCustomer() {
    const navigate = useNavigate();
    const [customers, setCustomers] = useState([]);
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [searchCPF, setSearchCPF] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const customersCollection = collection(db, 'customers');
                const customerSnapshot = await getDocs(customersCollection);
                const customerList = customerSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setCustomers(customerList);
                setFilteredCustomers(customerList); // Inicialmente, todos os clientes são mostrados
            } catch (err) {
                console.error("Erro ao buscar clientes:", err);
                setError("Erro ao buscar clientes. Tente novamente mais tarde.");
            }
        };
        fetchCustomers();
    }, []);

    const handleDeleteCustomer = async (id) => {
        try {
            await deleteDoc(doc(db, 'customers', id));
            setCustomers(customers.filter(customer => customer.id !== id));
            setFilteredCustomers(filteredCustomers.filter(customer => customer.id !== id));
        } catch (err) {
            console.error("Erro ao deletar cliente:", err);
            setError("Erro ao deletar cliente. Tente novamente mais tarde.");
        }
    };

    const handleSearch = () => {
        const filtered = customers.filter(customer => customer.cpf.includes(searchCPF));
        setFilteredCustomers(filtered);
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

                    </MDBTypography>
                </MDBContainer>

                {error && <p>{error}</p>}
                <MDBContainer>

                    <MDBRow className="mt-3 justify-content-start">
                        <MDBCol md="3">
                            <MDBInput
                                label="Buscar por CPF"
                                value={searchCPF}
                                onChange={(e) => setSearchCPF(e.target.value)}
                                id="searchCPF"
                                type="text"
                            />
                        </MDBCol>
                    </MDBRow>
                    <br />
                    <MDBBtn onClick={handleSearch}>Pesquisar</MDBBtn>
                    <div className="table-responsive">
                        <MDBTable className="mt-3">
                            <MDBTableHead light>
                                <tr>
                                    <th scope='row'>CPF</th>
                                    <th scope='row'>NOME</th>
                                    <th scope='row'>ESTADO</th>
                                    <th scope='row'>AÇÕES</th>
                                </tr>
                            </MDBTableHead>
                            <MDBTableBody>
                                {filteredCustomers.map((item) => (
                                    <tr key={item.id}>
                                        <td className="text-start">{item.cpf}</td>
                                        <td className="text-start">{item.nome}</td>
                                        <td className="text-start">{item.uf}</td>
                                        <td>
                                            <MDBRow className="mt-3">
                                                <MDBCol className="d-flex ">
                                                    <MDBBtn className="me-3" onClick={() => navigate(`/customers/${item.id}`)}>Editar</MDBBtn>
                                                    <MDBBtn onClick={() => handleDeleteCustomer(item.id)} color="danger">Deletar</MDBBtn>
                                                </MDBCol>
                                            </MDBRow>
                                        </td>
                                    </tr>
                                ))}
                            </MDBTableBody>
                        </MDBTable>
                    </div>
                </MDBContainer>
            </div>
            <Footer></Footer>
        </>
    );
}
