import React, { useEffect, useState } from 'react';
import { MDBInput, MDBBtn, MDBContainer, MDBTypography, MDBRow, MDBCol } from 'mdb-react-ui-kit';
import Navbar from '../Header/Navbar';
import { db } from '../Services/firebase';
import { getDoc, doc, updateDoc } from 'firebase/firestore';
import { useNavigate, useParams } from 'react-router-dom'; // Certifique-se de importar esses hooks
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import Footer from '../../components/Footer/Footer';
import '../../App.css'

export default function EditCustomer() {
    const [customer, setCustomer] = useState({
        nome: '',
        cpf: '',
        dateOfBirth: '',
        street: '',
        number: '',
        phone: '',
        cep: '',
        place: '',
        city: '',
        uf: ''
    });

    const navigate = useNavigate(); // Hook para navegação
    const { id } = useParams(); // Pegando o ID do cliente da URL

    useEffect(() => {
        const fetchCustomer = async () => {
            const customerDoc = await getDoc(doc(db, 'customers', id));
            if (customerDoc.exists()) {
                setCustomer({ id: customerDoc.id, ...customerDoc.data() });
            } else {
                alert("Cliente não encontrado!");
                navigate('/customers');
            }
        };
        fetchCustomer();
    }, [id, navigate]);

    const handleSave = async () => {
        try {
            // Validação dos campos
            if (customer.nome === '' || customer.cpf === '') {
                alert("Nome e CPF são obrigatórios!");
                return;
            }

            // Atualiza o cliente no Firestore
            await updateDoc(doc(db, 'customers', id), customer);
            navigate('/listCustomer');
            alert("Atualizado com sucesso");
        } catch (error) {
            console.error("Erro ao atualizar o cliente:", error);
        }
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
                    Edite os dados do cliente
                </MDBTypography>
            </MDBContainer>

            <MDBContainer>
                        <MDBInput
                            className="mb-3" // Adiciona margem inferior
                            label="Nome completo"
                            value={customer.nome}
                            onChange={(e) => setCustomer({ ...customer, nome: e.target.value })}
                            id="typeText"
                            type="text"
                        />
                        <MDBInput
                            className="mb-3" // Adiciona margem inferior
                            label="CPF"
                            value={customer.cpf}
                            onChange={(e) => setCustomer({ ...customer, cpf: e.target.value })}
                            id="typeText"
                            type="text"
                        />
                        <MDBInput
                            className="mb-3" // Adiciona margem inferior
                            label="Data de Nascimento"
                            value={customer.dateOfBirth}
                            onChange={(e) => setCustomer({ ...customer, dateOfBirth: e.target.value })}
                            id="typeDate"
                            type="date"
                        />
                        <MDBInput
                            className="mb-3" // Adiciona margem inferior
                            label="Rua"
                            value={customer.street}
                            onChange={(e) => setCustomer({ ...customer, street: e.target.value })}
                            id="typeText"
                            type="text"
                        />
                        <MDBInput
                            className="mb-3" // Adiciona margem inferior
                            label="Número"
                            value={customer.number}
                            onChange={(e) => setCustomer({ ...customer, number: e.target.value })}
                            id="typeNumber"
                            type="number"
                        />
                        <MDBInput
                            className="mb-3" // Adiciona margem inferior
                            label="Telefone"
                            value={customer.phone}
                            onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                            id="typeText"
                            type="text"
                        />
                        <MDBInput
                            className="mb-3" // Adiciona margem inferior
                            label="CEP"
                            value={customer.cep}
                            onChange={(e) => setCustomer({ ...customer, cep: e.target.value })}
                            id="typeText"
                            type="text"
                        />
                        <MDBInput
                            className="mb-3" // Adiciona margem inferior
                            label="Lugar"
                            value={customer.place}
                            onChange={(e) => setCustomer({ ...customer, place: e.target.value })}
                            id="typeText"
                            type="text"
                        />
                        <MDBInput
                            className="mb-3" // Adiciona margem inferior
                            label="Cidade"
                            value={customer.city}
                            onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                            id="typeText"
                            type="text"
                        />
                        <MDBInput
                            className="mb-3" // Adiciona margem inferior
                            label="UF"
                            value={customer.uf}
                            onChange={(e) => setCustomer({ ...customer, uf: e.target.value })}
                            id="typeText"
                            type="text"
                        />
                        <MDBRow className="mt-3">
                            <MDBCol>
                                <MDBBtn onClick={handleSave}>Salvar</MDBBtn>
                            </MDBCol>
                            <MDBCol className="text-end">
                                <MDBBtn className='me-1' color='danger' onClick={() => navigate('/listCustomer')}>Voltar</MDBBtn>
                            </MDBCol>
                        </MDBRow>
            </MDBContainer>
            </div><br />
            <Footer></Footer>
        </>
    );
}
