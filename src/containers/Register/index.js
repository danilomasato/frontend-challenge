import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import "./Register.css";
import { Header } from "../../components/Header";
import { TopInfo } from "../../components/TopInfo";
import { TopHeader } from "../../components/TopHeader";
import { Footer } from "../../components/Footer";
import SendIcon from '@mui/icons-material/Send';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import { TextField, Box, Button } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import Checkbox from '@mui/material/Checkbox';

const Register = ({ props }) => {

  const [email, setEmail] = useState('');
  const [erro, setErro] = useState(false);
  const label = { slotProps: { input: { 'aria-label': 'Checkbox demo' } } };

  const validarEmail = (valor) => {
    // Regex simples para validação de formato de e-mail
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(valor);
  };

  const handleChange = (e) => {
    const valor = e.target.value;
    setEmail(valor);
    
    // Atualiza o estado de erro baseado na validação
    setErro(!validarEmail(valor));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!erro && email.length > 0) {
      alert(`E-mail enviado: ${email}`);
    } else {
      setErro(true);
    }
  };

  const JWTToken = "b80e112ff544e1a8399201e6edb52393854b6e3e4903eaba176fcf52bd258c37b7b81454bdfb131181390d65727d8ca64e71e6c12112426d984513f29930d14444ca2a694bb62dd9cab3501ae120642fbb17235558ae03a1ee15a665476a80b39ddc22159169bbb71aacc90f8be07d2bfe867886ccbf2b037069a3c69635ac04"
  axios
  .post('http://localhost:1337/admin/users', {
    firstname: "jose",
    lastname: "silva",
    roles: ["2", "3"]
  }, {
  headers: {
    'Authorization': `Bearer ${JWTToken}`
  }
  })
  .then(response => {
    // Handle success.
    console.log('Well done!');
    console.log('User profile', response.data.user);
    console.log('User token', response.data.jwt);
  })
  .catch(error => {
    // Handle error.
    console.log('An error occurred:', error.response);
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <React.Fragment>
      <TopInfo />
      <Header />

      <div className="row center">
        <div className="content" style={{ minHeight: "auto",  display: "block" }}>
          <div sx={{ width: '100%' }}>
            <Box className="form-left">
              <Typography variant="h5" className="title">
                Venha ser <br />
                um corretor
              </Typography>

              <Typography variant="h2" className="description">
                Faça parte da nossa equipe e <br />
                usufrua de nossa ferramenta <br />
                para expandir seus <br />
                negócios como corretor(a)
              </Typography> 
            </Box>
            <Box
              className="form"
              component="form"
              sx={{ '& > :not(style)': { m: 1, width: '100%' } }}
              noValidate
              autoComplete="off"
            >
              <Typography variant="h5" className="title">
                <PersonAddAltIcon style={{ marginRight: '10px'}}/> Crie Sua Conta
              </Typography>
              <Typography variant="h2" className="description">
                Preencha os dados abaixo para se cadastrar
              </Typography> 
              
              <TextField id="outlined-basic" label="Digite seu Nome..." variant="outlined" 
               style={{float: 'left', width: '46%'}} />
              <TextField id="outlined-basic" label="Digite seu Sobrenome..." variant="outlined" 
              style={{float: 'left', width: '46%'}} />
              <TextField id="outlined-basic" label="Digite usuário para login..." variant="outlined" 
               style={{float: 'left', width: '46%'}} />
              <TextField
               style={{float: 'left', width: '46%'}} 
              label="Password"
              type={showPassword ? 'text' : 'password'}
              variant="outlined" // or "filled", "standard"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Endereço de E-mail"
                name="email"
                type="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={handleChange}
                error={erro}
                helperText={erro ? "Por favor, digite um e-mail válido." : ""}
              />

              <Typography className="ThumbSLider-description" gutterBottom>
                <Checkbox {...label} defaultChecked style={{ paddingLeft: '0' }}/> Estando de acordo, você aceita nosso <a href="https://drive.google.com/file/d/14KrwuRBWVf1IT5m7Iu4FqS7D-bgyIYdE/view?usp=sharing" target="_blank">termos</a>
              </Typography>
              <Button variant="contained" endIcon={<SendIcon />}>
                Cadastrar
              </Button>
            </Box>
          </div>
        </div>
      </div>

      <Footer />
    </React.Fragment>
  );
};

export default Register;
