import React, { useState, useEffect } from 'react';
import { MDBInput, MDBBtn, MDBContainer, MDBTypography, MDBCol, MDBRow } from 'mdb-react-ui-kit';
import Navbar from '../Header/Navbar';
import { db } from '../Services/firebase';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import { useNavigate } from 'react-router-dom';
import { Timestamp } from 'firebase/firestore';
import Footer from '../../components/Footer/Footer';
import '../../App.css'

export default function AddHosting() {
  const navigate = useNavigate();
  const [customerCPF, setCustomerCPF] = useState('');
  const [customerName, setCustomerName] = useState(''); // Estado para armazenar o nome do cliente
  const [searchBy, setSearchBy] = useState('cpf'); // Estado para determinar o tipo de busca (cpf ou nome)
  const [customer, setCustomer] = useState(null);
  const [hosting, setHosting] = useState({
    dateCheckin: '',
    dateCheckout: '',
    numberOfDays: 0,
    dailyRate: 0,
    platformFee: 0,
    total: 0,
  });
  const [error, setError] = useState('');

  // Função para buscar o cliente
  const handleSearchCustomer = async () => {
    try {
      let customerQuery;
      if (searchBy === 'cpf') {
        // Busca por CPF
        customerQuery = query(
          collection(db, 'customers'),
          where('cpf', '==', customerCPF)
        );
      } else {
        // Busca por nome (primeiro nome)
        customerQuery = query(
          collection(db, 'customers'),
          where('nome', '>=', customerName),
          where('nome', '<=', customerName + '\uf8ff')
        );
      }

      const customerSnapshot = await getDocs(customerQuery);

      if (customerSnapshot.empty) {
        alert('Cliente não encontrado. Cadastre um novo cliente');
        setCustomer(null);
      } else {
        const customerData = customerSnapshot.docs[0].data();
        setCustomer({ id: customerSnapshot.docs[0].id, ...customerData });
      }
    } catch (error) {
      console.error('Erro ao buscar cliente:', error);
      alert('Erro ao buscar cliente.');
    }
  };

  // Função para calcular a quantidade de diárias e o valor total
  const calculateDaysAndTotal = () => {
    const checkinDate = new Date(hosting.dateCheckin);
    const checkoutDate = new Date(hosting.dateCheckout);
    const dailyRate = Number(hosting.dailyRate);
    const platformFee = Number(hosting.platformFee);

    if (checkinDate && checkoutDate > checkinDate) {
      const timeDifference = checkoutDate - checkinDate;
      const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24)); // Converte de milissegundos para dias
      const total = (daysDifference * dailyRate) - platformFee;  // Calcula o valor total

      setHosting((prev) => ({
        ...prev,
        numberOfDays: daysDifference,
        total: total.toFixed(2),
      }));
    } else {
      setHosting((prev) => ({
        ...prev,
        numberOfDays: 0,
        total: 0,
      }));
    }
  };

  useEffect(() => {
    calculateDaysAndTotal();
  }, [hosting.dateCheckin, hosting.dateCheckout, hosting.dailyRate]);

  const checkDateAvailability = async () => {
    try {
      const hostingQuery = query(collection(db, 'hosting'));
      const hostingSnapshot = await getDocs(hostingQuery);

      const newCheckinDate = new Date(hosting.dateCheckin);
      const newCheckoutDate = new Date(hosting.dateCheckout);

      for (const doc of hostingSnapshot.docs) {
        const existingCheckinDate = doc.data().dateCheckin.toDate();
        const existingCheckoutDate = doc.data().dateCheckout.toDate();

        if (
          (newCheckinDate >= existingCheckinDate && newCheckinDate < existingCheckoutDate) ||
          (newCheckoutDate > existingCheckinDate && newCheckoutDate <= existingCheckoutDate) ||
          (newCheckinDate <= existingCheckinDate && newCheckoutDate >= existingCheckoutDate)
        ) {
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Erro ao verificar disponibilidade de datas:', error);
      return false;
    }
  };

  const handleAddHosting = async () => {
    const isDateUnavailable = await checkDateAvailability();
    if (isDateUnavailable) {
      setError('Data indisponível. Já existe uma reserva para o período selecionado.');
      return;
    }

    try {
      await addDoc(collection(db, 'hosting'), {
        customerId: customer.id,
        dateCheckin: Timestamp.fromDate(new Date(hosting.dateCheckin)),
        dateCheckout: Timestamp.fromDate(new Date(hosting.dateCheckout)),
        numberOfDays: hosting.numberOfDays,
        dailyRate: hosting.dailyRate,
        platformFee: hosting.platformFee,
        total: hosting.total,
      });
      alert('Hospedagem adicionada com sucesso!');
      setHosting({
        dateCheckin: '',
        dateCheckout: '',
        numberOfDays: 0,
        dailyRate: 0,
        platformFee: 0,
        total: 0,
      });
      setCustomer(null);
      setCustomerCPF('');
      setCustomerName('');
      setError('');
    } catch (error) {
      console.error('Erro ao adicionar hospedagem:', error);
      alert('Erro ao adicionar hospedagem.');
    }
  };

  return (
    <>
      <Navbar /><br />
      <div className="main-content">
        <MDBContainer className="text-center py-5">
          <MDBTypography tag="h1" className="display-4 text-primary">
            Gerenciamento de Hospedagem
          </MDBTypography>
          <MDBTypography tag="p" className="lead">
            Adicione uma reserva agora!
          </MDBTypography>
        </MDBContainer>

        <MDBContainer>
          <div className="mb-3">
            <label>
              <input
                type="radio"
                name="searchBy"
                value="cpf"
                checked={searchBy === 'cpf'}
                onChange={() => setSearchBy('cpf')}
              />
              Buscar por CPF
            </label>
            <label className="ms-3">
              <input
                type="radio"
                name="searchBy"
                value="name"
                checked={searchBy === 'name'}
                onChange={() => setSearchBy('name')}
              />
              Buscar por Nome
            </label>
          </div>

          {searchBy === 'cpf' ? (
            <MDBInput
              label="CPF do Cliente"
              value={customerCPF}
              onChange={(e) => setCustomerCPF(e.target.value)}
              id="cpfInput"
              type="text"
              className="mb-3"
            />
          ) : (
            <MDBInput
              label="Primeiro Nome do Cliente"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              id="nameInput"
              type="text"
              className="mb-3"
            />
          )}
          <MDBBtn onClick={handleSearchCustomer} className="mb-3">Buscar Cliente</MDBBtn>

          {customer && (
            <>
              <h3>Cliente Selecionado:</h3>
              <p>Nome: {customer.nome}</p>
              <p>CPF: {customer.cpf}</p>

              <MDBInput
                label="Data de Check-in"
                value={hosting.dateCheckin}
                onChange={(e) => {
                  setHosting({ ...hosting, dateCheckin: e.target.value });
                  calculateDaysAndTotal();
                }}
                id="checkinInput"
                type="date"
                className="mb-3"
              />
              <MDBInput
                label="Data de Check-out"
                value={hosting.dateCheckout}
                onChange={(e) => {
                  setHosting({ ...hosting, dateCheckout: e.target.value });
                  calculateDaysAndTotal();
                }}
                id="checkoutInput"
                type="date"
                className="mb-3"
              />
              <MDBInput
                label="Valor da Diária"
                value={hosting.dailyRate}
                onChange={(e) => {
                  const dailyRate = e.target.value;
                  setHosting({ ...hosting, dailyRate });
                  calculateDaysAndTotal();
                }}
                id="dailyRateInput"
                type="number"
                className="mb-3"
              />
              <MDBInput
                label="Quantidade de Diárias"
                type="number"
                value={hosting.numberOfDays}
                disabled
                className="mb-3"
              />
              <MDBInput
                label="Taxa de Plataforma"
                value={hosting.platformFee}
                onChange={(e) => {
                  const platformFee = e.target.value;
                  setHosting({ ...hosting, platformFee });
                  calculateDaysAndTotal();
                }}
                id="platformFeeInput"
                type="number"
                className="mb-3"
              />
              <MDBInput
                label="Total"
                value={hosting.total}
                disabled
                className="mb-3"
              />

              {error && <p className="text-danger">{error}</p>}

              <MDBBtn onClick={handleAddHosting} className="mb-3">Adicionar Hospedagem</MDBBtn>
            </>
          )}
        </MDBContainer>
      </div>
      <Footer />
    </>
  );
}
