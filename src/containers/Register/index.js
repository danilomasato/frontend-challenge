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
import { Loading } from "../../components/Loading";

const Register = ({ props }) => {

  const [email, setEmail] = useState('');
  const [erro, setErro] = useState(false);
  const label = { slotProps: { input: { 'aria-label': 'Checkbox demo' } } };
  const [showPassword, setShowPassword] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    user: '',
    email: '', 
    password: '',
    creci: '',
    termsAccepted: false
  });

const passwordValidation = {
  minLength: formData.password.length >= 8,
  uppercase: /[A-Z]/.test(formData.password),
  lowercase: /[a-z]/.test(formData.password),
  number: /\d/.test(formData.password),
  special: /[^A-Za-z0-9]/.test(formData.password),
};

const isPasswordValid =
  Object.values(passwordValidation).every(Boolean);

const isCreciValid = /^\d{3}\.\d{3}$/.test(formData.creci);

const isFormValid =
  formData.name.trim() !== '' &&
  formData.surname.trim() !== '' &&
  formData.user.trim() !== '' &&
  isCreciValid &&
  formData.email.trim() !== '' &&
  !erro &&
  isPasswordValid &&
  formData.termsAccepted;

const handleChange = (e) => {
  const { name, value, type, checked } = e.target;

  let newValue = value;

  if (type === 'checkbox') {
    newValue = checked;
  }

  if (name === 'creci') {
    const numbers = value.replace(/\D/g, '').slice(0, 6);

    newValue =
      numbers.length > 3
        ? `${numbers.slice(0, 3)}.${numbers.slice(3)}`
        : numbers;
  }

  setFormData((prev) => ({
    ...prev,
    [name]: newValue,
  }));

  if (name === 'email') {
    setEmail(value);
    setErro(!validarEmail(value));
  }
};
  
  let JWTToken

  const validarEmail = (valor) => {
    // Regex simples para validação de formato de e-mail
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(valor);
  };

  const formatCreci = (value) => {
    const numbers = value.replace(/\D/g, '').slice(0, 6);

    if (numbers.length <= 3) {
      return numbers;
    }

    return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isPasswordValid) {
      alert(
        "A senha deve conter no mínimo 8 caracteres, uma letra maiúscula, uma letra minúscula, um número e um caractere especial."
      );
      return;
    }

    setLoading(true);

    if (isFormValid) {
      setOpen(true);

      axios.post('https://sublime-bat-ad2fca1255.strapiapp.com/admin/login', {
        "email": "danilomasato@hotmail.com",
        "password": "Admin@123"
      })
        .then(response => {
          // Handle success.
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
              console.log('usuario criado!');
              
              const id = response.data.data.id.toString()

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
              })
              .catch(error => {
                // Handle error.
                console.log('An error occurred:', error.response);
              });

              //api corretores para registrar o CRECI
              axios.post(`https://sublime-bat-ad2fca1255.strapiapp.com/api/brokers`, {
                  "data": {
                    "nome":formData.name,
                    "sobrenome": formData.surname,
                    "creci": formData.creci.replace(/\./g, ""),
                    "email": formData.email
                  }}, {
                  headers: {
                    //token FullAcess fixo para registrar Coleção API Corretores
                    'Authorization': `Bearer bb71d99fd4e9cc6af847e1f75af8eb8eb895c8cdc50b835d210efbf504e1bdb69005dd946f1c001a554d6eb8f867941f76e7dd8183213298576dd0cf0081c92a89117e759cdd270cc1fc3a46bd7bdf0a19489ee45c2bebf79828e2e775dfaaf2aad1feec705c8b4ebd14d470c9fa46fbca5734e8f98f20cb932193d3db19a050`
                  }})
                  .then(response => {
                    // Handle success.
                    console.log('brokers', response);
                    setLoading(false);
                    setTimeout(()=> {
                      //fecha modal
                      setOpen(false);
                      window.location.href = 'https://sublime-bat-ad2fca1255.strapiapp.com/admin'
                    }, 6000)
                  })
                  .catch(error => {
                    // Handle error.
                    console.log('An error occurred:', error.response);
                  });
              })
              .catch(error => {
                // Handle error.
                console.log('An error occurred:', error.response);
              })
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
            <div className="content" style={{ minHeight: "50px",  display: "block", width: "500px" }}>

              {loading ?
                <>
                  <img style={{ left: 'inherit' }} src="https://cdn.pixabay.com/animation/2023/05/02/04/29/04-29-06-428_512.gif" className="overlay-img" />
                  <Typography variant="h5" className="title" style={{ 
                    float: 'left',
                    border: '0'
                    }}
                    >
                    Registrando
                  </Typography>
                </>

              : 
              <>
                <img src="https://tudosobreap.com.br/assets/images/loading.gif" width="100"/>
                <Typography variant="h2" className="description">
                  Você foi registrado com Sucesso ! <br />
                  Vamos Redirecionar você para página de Administração de imóveis da TSA
                </Typography> 
              </>
              } 
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
                Venha ser<br />
                parceiro TSA
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
              <TextField id="outlined-basic" label="Digite seu usuário..." variant="outlined" 
              onChange={handleChange} 
              value={formData.user}
              name="user"
              style={{float: 'left', width: '46%'}} />
              
              <TextField id="outlined-basic" label="Digite seu CRECI..." variant="outlined"  
              onChange={handleChange} 
              value={formData.creci}
              name="creci"
               style={{float: 'left', width: '46%'}} />
              
              <Box style={{ position: 'relative', float: 'left', width: '100%' }}>
                <TextField
                  style={{ width: '100%' }}
                  label="Senha"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  type={showPassword ? 'text' : 'password'}
                  variant="outlined"
                />

                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: '-320px',
                    width: '290px',
                    background: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    padding: '16px',
                    boxShadow: '0 10px 30px rgba(0,0,0,.08)',
                    zIndex: 10,

                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: '22px',
                      right: '-10px',
                      width: '18px',
                      height: '18px',
                      background: '#fff',
                      borderTop: '1px solid #e5e7eb',
                      borderRight: '1px solid #e5e7eb',
                      transform: 'rotate(45deg)',
                    },

                    // 📱 MOBILE
                    '@media (max-width: 768px)': {
                      position: 'relative',
                      top: 'auto',
                      left: 'auto',
                      width: '100%',
                      boxSizing: 'border-box',
                      marginTop: '12px',
                      marginBottom: '8px',
                      padding: '14px',

                      // Remove a setinha do pop-up
                      '&::before': {
                        display: 'none',
                      },
                    },
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 600,
                      mb: 1.5,
                    }}
                  >
                    Requisitos da senha
                  </Typography>

                  <div>
                    {passwordValidation.minLength ? "✅" : "❌"} Mínimo de 8 caracteres
                    {!passwordValidation.minLength &&
                      ` (${formData.password.length}/8)`}
                  </div>

                  <div>
                    {passwordValidation.uppercase ? "✅" : "❌"} Uma letra maiúscula
                  </div>

                  <div>
                    {passwordValidation.lowercase ? "✅" : "❌"} Uma letra minúscula
                  </div>

                  <div>
                    {passwordValidation.number ? "✅" : "❌"} Um número
                  </div>

                  <div>
                    {passwordValidation.special ? "✅" : "❌"} Um caractere especial
                  </div>
                </Box>

                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                  style={{
                    position: 'absolute',
                    right: '1.2rem',
                    top: '0.5rem'
                  }}
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
              <Checkbox
                {...label}
                name="termsAccepted"
                checked={formData.termsAccepted}
                onChange={handleChange}
                style={{ paddingLeft: '0' }}
              />

              Estando de acordo, você aceita nosso{' '}

              <a
                href="https://drive.google.com/file/d/14KrwuRBWVf1IT5m7Iu4FqS7D-bgyIYdE/view?usp=sharing"
                target="_blank"
                rel="noreferrer"
              >
                termos
              </a>
            </Typography>
              <Button
                type="submit"
                variant="contained"
                endIcon={<SendIcon />}
                disabled={!isFormValid || loading}
              >
                {loading ? "Cadastrando..." : "Cadastrar"}
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
