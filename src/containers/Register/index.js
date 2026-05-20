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
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import CloseIcon from '@mui/icons-material/Close';

const Register = ({ props }) => {

  const [email, setEmail] = useState('');
  const [erro, setErro] = useState(false);
  const label = { slotProps: { input: { 'aria-label': 'Checkbox demo' } } };
  const [showPassword, setShowPassword] = useState(false);
  const [open, setOpen] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    user: '',
    email: '', 
    password: '' 
  });

  const handleChange = (e) => {
    const valor = e.target.value;

    setFormData({ ...formData, [e.target.name]: e.target.value });
    setEmail(valor);
    
    // Atualiza o estado de erro baseado na validação
    setErro(!validarEmail(valor));
  };
  
  let JWTToken

  const validarEmail = (valor) => {
    // Regex simples para validação de formato de e-mail
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(valor);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!erro && email.length > 0) {
       axios.post('https://sublime-bat-ad2fca1255.strapiapp.com/admin/login', {
          "email": "danilomasato@hotmail.com",
          "password": "Admin@123"
        })
          .then(response => {
            // Handle success.
            console.log('usuario criado!');
            JWTToken = response.data.data.accessToken
            console.log('User profile', response.data.data.accessToken);
            axios.post('https://sublime-bat-ad2fca1255.strapiapp.com/admin/users', {
                "firstname":formData.name,
                "lastname": formData.surname,
                "email": formData.email,
                "roles":["2"]
              }, {
              headers: {
                'Authorization': `Bearer ${JWTToken}`
              }})
              .then(response => {
               
                const id = response.data.data.id.toString()
                console.log(id)
                axios.put(`https://sublime-bat-ad2fca1255.strapiapp.com/admin/users/${id}`, {
                  "firstname":formData.name,
                  "lastname": formData.surname,
                  "password": formData.password,
                  "roles":["2"],  
                  "isActive": true
                  }, {
                  headers: {
                    'Authorization': `Bearer ${JWTToken}`
                  }})
                  .then(response => {
                    // Handle success.
                    console.log('usuario ativado!');
                    setOpen(true);

                    setTimeout(()=> {
                      //abre modal
                      setOpen(false);
                      window.location.href = 'https://sublime-bat-ad2fca1255.strapiapp.com/admin'
                    }, 60000)
                  })
                  .catch(error => {
                    // Handle error.
                    console.log('An error occurred:', error.response);
                  });
              })
              .catch(error => {
                // Handle error.
                console.log('An error occurred:', error.response);
              });
          })
          .catch(error => {
            // Handle error.
            console.log('An error occurred:', error.response);
          });
    } else {
      setErro(true);
    }
  };

  return (
    <React.Fragment>
      <TopInfo />
      <Header />

      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth="lg"
        maxWidth="lg"
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent className="success">
            <div className="row center">
            <div className="content" style={{ minHeight: "auto",  display: "block", width: "500px" }}>
              <img src="https://tudosobreap.com.br/assets/images/loading.gif" width="100"/>
              <Typography variant="h2" className="description">
                Você foi registrado com Sucesso ! <br />
                Vamos Redirecionar você para página de Administração de imóveis da TSA
              </Typography> 
                
            </div>
          </div>
        </DialogContent>
        <CloseIcon className="modal-close" onClick={handleClose} />
      </Dialog>

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
              onSubmit={handleSubmit}
            >
              <Typography variant="h5" className="title">
                <PersonAddAltIcon style={{ marginRight: '10px'}}/> Crie Sua Conta
              </Typography>
              <Typography variant="h2" className="description">
                Preencha os dados abaixo para se cadastrar
              </Typography> 
              
              <TextField id="outlined-basic" label="Digite seu Nome..." variant="outlined" 
              onChange={handleChange} 
              value={formData.name}
              name="name"
               style={{float: 'left', width: '46%'}} />
              <TextField id="outlined-basic" label="Digite seu Sobrenome..." variant="outlined" 
              onChange={handleChange} 
              value={formData.surname}
              name="surname"
              style={{float: 'left', width: '46%'}} />
              <TextField id="outlined-basic" label="Digite usuário para login..." variant="outlined"  
              onChange={handleChange} 
              value={formData.user}
              name="user"
               style={{float: 'left', width: '46%'}} />
              <Box style={{ position: 'relative', float: 'left', width: '46%' }}>
                <TextField
                  style={{width: '100%'}} 
                  label="Senha"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  type={showPassword ? 'text' : 'password'}
                  variant="outlined" // or "filled", "standard"
                  
                />
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                  style={{ position: 'absolute', right: '1.2rem', top: '0.5rem'}}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </Box>
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
                value={formData.email}
                onChange={handleChange}
                error={erro}
                helperText={erro ? "Por favor, digite um e-mail válido." : ""}
              />

              <Typography className="ThumbSLider-description" gutterBottom>
                <Checkbox {...label} defaultChecked style={{ paddingLeft: '0' }}/> Estando de acordo, você aceita nosso <a href="https://drive.google.com/file/d/14KrwuRBWVf1IT5m7Iu4FqS7D-bgyIYdE/view?usp=sharing" target="_blank">termos</a>
              </Typography>
              <Button type="submit" variant="contained" endIcon={<SendIcon />}>
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
