import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../Services/firebase';
import {
    MDBBtn,
    MDBContainer,
    MDBCard,
    MDBCardBody,
    MDBRow,
    MDBCol,
    MDBInput
} from 'mdb-react-ui-kit';
import '../../Background.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        if (!email || !password) {
            setErrorMessage('Por favor, preencha todos os campos.');
            return;
        }

        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/hosting');
        } catch (error) {
            setErrorMessage('Usuário ou senha inválidos.');
        }
    };

    return (
        <div className="main-content">
            <MDBContainer className='animated-background' style={{ padding: '20px' }}>
                <MDBCard className='mx-auto my-5' style={{ maxWidth: '400px', margin: '0 15px' }}>
                    <MDBRow className='g-0'>
                        <MDBCol md='12'>
                            <MDBCardBody className='d-flex flex-column align-items-center'>
                                <div className='d-flex flex-row mt-2'>
                                    {/* <MDBIcon fas icon="cubes fa-3x me-3" style={{ color: '#ff6219' }} /> */}
                                    <img src="DevF.png" alt="" style={{ width: '100px', borderRadius: '40px' }} />
                                </div>

                                <h5 className="fw-normal my-4 pb-3" style={{ letterSpacing: '1px' }}>Acesse o sistema</h5>
                                {errorMessage && (
                                    <div className="alert alert-danger text-center" role="alert">
                                        <strong>Erro:</strong> {errorMessage}
                                    </div>
                                )}

                                <MDBInput
                                    wrapperClass='mb-4'
                                    label='Email'
                                    type='email'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <MDBInput
                                    wrapperClass='mb-4'
                                    label='Senha'
                                    type='password'
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />

                                <MDBBtn
                                    className="mb-4 px-5"
                                    color='dark'
                                    size='lg'
                                    onClick={handleLogin}
                                >
                                    Acesse
                                </MDBBtn>

                                <a className="small text-muted" href="#!">Esqueceu sua senha?</a>
                                <p className="mb-5 pb-lg-2" style={{ color: '#393f81' }}>
                                    Não tem uma conta? <a href="#!" style={{ color: '#393f81' }}>Registre aqui</a>
                                </p>

                                <div className='d-flex flex-row justify-content-start'>
                                    <a href="#!" className="small text-muted me-1">Termos de uso.</a>
                                    <a href="#!" className="small text-muted">Política de privacidade</a>
                                </div>
                            </MDBCardBody>
                        </MDBCol>
                    </MDBRow>
                </MDBCard>
            </MDBContainer>

        </div>
    );
};

export default Login;
