import React, { useState } from 'react';
import { MDBInput, MDBBtn, MDBContainer, MDBTypography, MDBRow, MDBCol } from 'mdb-react-ui-kit';
import Navbar from '../Header/Navbar';
import { db } from '../Services/firebase';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import { useNavigate } from 'react-router-dom';
import Footer from '../../components/Footer/Footer';
import '../../App.css';

export default function AddCustomer() {
  const navigate = useNavigate();
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

  const validateCPF = (cpf) => {
    cpf = cpf.replace(/\D/g, ''); // Remove caracteres não numéricos
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
      return false; // Verifica se todos os dígitos são iguais ou se o CPF não tem 11 dígitos
    }

    let soma = 0;
    for (let i = 0; i < 9; i++) {
      soma += parseInt(cpf.charAt(i)) * (10 - i);
    }

    let resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) {
      resto = 0;
    }
    if (resto !== parseInt(cpf.charAt(9))) {
      return false;
    }

    soma = 0;
    for (let i = 0; i < 10; i++) {
      soma += parseInt(cpf.charAt(i)) * (11 - i);
    }

    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) {
      resto = 0;
    }

    return resto === parseInt(cpf.charAt(10));
  };

  const checkCPFExists = async (cpf) => {
    if (!cpf) return false; // Se o CPF não for preenchido, não verifica
    const q = query(collection(db, 'customers'), where('cpf', '==', cpf));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  };

  const handleSave = async () => {
    // Validar CPF somente se preenchido
    if (customer.cpf && !validateCPF(customer.cpf)) {
      alert('CPF inválido.');
      return;
    }

    // Verificar se o CPF já existe (apenas se for preenchido)
    const cpfExists = await checkCPFExists(customer.cpf);
    if (cpfExists) {
      alert('CPF já cadastrado.');
      return;
    }

    // Verificação de idade (se for menor de idade, impedir cadastro)
    const today = new Date();
    const birthDate = new Date(customer.dateOfBirth);
    const age = today.getFullYear() - birthDate.getFullYear();
    const isUnderage = age < 18 || (age === 18 && today < birthDate.setFullYear(today.getFullYear()));

    if (isUnderage) {
      alert('Você precisa ter pelo menos 18 anos para se cadastrar.');
      return;
    }

    // Salvar cliente no banco de dados
    try {
      await addDoc(collection(db, 'customers'), customer);
      alert('Cliente salvo com sucesso!');
      setCustomer({
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
      navigate('/listCustomer');
    } catch (error) {
      console.error('Erro ao salvar o cliente:', error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="main-content">
        <MDBContainer className="text-center py-5">
          <MDBTypography tag="h1" className="display-4 text-primary">
            Gerenciamento de clientes
          </MDBTypography>
          <MDBTypography tag="p" className="lead">
            Adicione um cliente
          </MDBTypography>
        </MDBContainer>

        <MDBContainer>
          <MDBInput
            label="Nome completo"
            value={customer.nome}
            onChange={(e) => setCustomer({ ...customer, nome: e.target.value })}
            id="typeText"
            type="text"
            className="mb-3"
          />
          <MDBInput
            label="CPF (opcional)"
            value={customer.cpf}
            onChange={(e) => setCustomer({ ...customer, cpf: e.target.value })}
            id="typeText"
            type="text"
            className="mb-3"
          />
          <MDBInput
            label="Data de Nascimento"
            value={customer.dateOfBirth}
            onChange={(e) => setCustomer({ ...customer, dateOfBirth: e.target.value })}
            id="typeDate"
            type="date"
            className="mb-3"
          />
          <MDBInput
            label="Rua"
            value={customer.street}
            onChange={(e) => setCustomer({ ...customer, street: e.target.value })}
            id="typeText"
            type="text"
            className="mb-3"
          />
          <MDBInput
            label="Número"
            value={customer.number}
            onChange={(e) => setCustomer({ ...customer, number: e.target.value })}
            id="typeNumber"
            type="number"
            className="mb-3"
          />
          <MDBInput
            label="Telefone"
            value={customer.phone}
            onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
            id="typeText"
            type="text"
            className="mb-3"
          />
          <MDBInput
            label="CEP"
            value={customer.cep}
            onChange={(e) => setCustomer({ ...customer, cep: e.target.value })}
            id="typeText"
            type="text"
            className="mb-3"
          />
          <MDBInput
            label="Lugar"
            value={customer.place}
            onChange={(e) => setCustomer({ ...customer, place: e.target.value })}
            id="typeText"
            type="text"
            className="mb-3"
          />
          <MDBInput
            label="Cidade"
            value={customer.city}
            onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
            id="typeText"
            type="text"
            className="mb-3"
          />
          <MDBInput
            label="UF"
            value={customer.uf}
            onChange={(e) => setCustomer({ ...customer, uf: e.target.value })}
            id="typeText"
            type="text"
            className="mb-3"
          />
          <MDBRow className="mt-3">
            <MDBCol>
              <MDBBtn onClick={handleSave}>Salvar</MDBBtn>
            </MDBCol>
            <MDBCol className="text-end">
              <MDBBtn className="me-1" color="danger" onClick={() => navigate('/listCustomer')}>
                Voltar
              </MDBBtn>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
        <br />
      </div>
      <Footer />
    </>
  );
}
