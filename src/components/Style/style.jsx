import React from 'react';
import { MDBContainer, MDBTypography } from 'mdb-react-ui-kit';
import './Background.css'; // Importa o arquivo CSS

const AnimatedBackground = () => {
    return (
        <MDBContainer fluid className="animated-background d-flex align-items-center justify-content-center">
            <MDBTypography tag="h1" className="text-dark">
                Bem-vindo ao Gerenciamento de Hospedagem
            </MDBTypography>
        </MDBContainer>
    );
};

export default AnimatedBackground;
