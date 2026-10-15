import React, { useState } from "react";
import "./Register.css";

import { Header } from "../../components/Header";
import { TopInfo } from "../../components/TopInfo";
import { Footer } from "../../components/Footer";

import SendIcon from "@mui/icons-material/Send";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { TextField, Box, Button } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import Checkbox from "@mui/material/Checkbox";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import CloseIcon from "@mui/icons-material/Close";

const STRAPI_URL = "https://sublime-bat-ad2fca1255.strapiapp.com";

const Register = () => {
  const [erro, setErro] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [creciFile, setCreciFile] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
    creci: "",
    termsAccepted: false,
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

  const validarEmail = (valor) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(valor);
  };

  const isFormValid =
    formData.name.trim() !== "" &&
    formData.surname.trim() !== "" &&
    isCreciValid &&
    validarEmail(formData.email) &&
    !erro &&
    isPasswordValid &&
    formData.termsAccepted &&
    creciFile !== null;

  const handleClickShowPassword = () => {
    setShowPassword((show) => !show);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = type === "checkbox" ? checked : value;

    if (name === "creci") {
      const numbers = value.replace(/\D/g, "").slice(0, 6);

      newValue =
        numbers.length > 3
          ? `${numbers.slice(0, 3)}.${numbers.slice(3)}`
          : numbers;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    if (name === "email") {
      setErro(value.trim() !== "" && !validarEmail(value));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      setCreciFile(null);
      return;
    }

    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert("Envie a credencial do CRECI em PDF, JPG ou PNG.");
      e.target.value = "";
      setCreciFile(null);
      return;
    }

    const maxSize = 10 * 1024 * 1024;

    if (file.size > maxSize) {
      alert("O arquivo deve ter no máximo 10 MB.");
      e.target.value = "";
      setCreciFile(null);
      return;
    }

    setCreciFile(file);
  };

  const handleClose = () => {
    if (!loading) {
      setOpen(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.surname.trim()) {
      alert("Preencha seu nome e sobrenome.");
      return;
    }

    if (!validarEmail(formData.email)) {
      setErro(true);
      alert("Digite um endereço de e-mail válido.");
      return;
    }

    if (!isPasswordValid) {
      alert(
        "A senha deve conter no mínimo 8 caracteres, uma letra maiúscula, uma letra minúscula, um número e um caractere especial."
      );
      return;
    }

    if (!isCreciValid) {
      alert("Digite um CRECI válido no formato 123.456.");
      return;
    }

    if (!creciFile) {
      alert("Envie a credencial do CRECI.");
      return;
    }

    if (!formData.termsAccepted) {
      alert("Você precisa aceitar os termos para continuar.");
      return;
    }

    if (!isFormValid) {
      return;
    }

    setLoading(true);
    setOpen(true);

    try {
      const registrationData = new FormData();

      registrationData.append("nome", formData.name.trim());
      registrationData.append("sobrenome", formData.surname.trim());
      registrationData.append("email", formData.email.trim());
      registrationData.append("password", formData.password);
      registrationData.append(
        "creci",
        formData.creci.replace(/\./g, "")
      );
      registrationData.append("credencialCreci", creciFile);

      const response = await axios.post(
        `${STRAPI_URL}/api/broker/register`,
        registrationData
      );

      if (response.data?.success !== true) {
        throw new Error(
          response.data?.message ||
            "O servidor não confirmou a conclusão do cadastro."
        );
      }

      setLoading(false);

      window.setTimeout(() => {
        setOpen(false);
        window.location.href = `${STRAPI_URL}/admin`;
      }, 6000);
    } catch (error) {
      console.error(
        "Erro durante o cadastro:",
        error.response?.data || error
      );

      setLoading(false);
      setOpen(false);

      alert(
        error.response?.data?.error?.message ||
          error.response?.data?.message ||
          error.message ||
          "Não foi possível concluir o cadastro. Verifique os dados e tente novamente."
      );
    }
  };

  return (
    <React.Fragment>
      <TopInfo />
      <Header />

      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="lg"
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent className="success">
          <div className="row center">
            <div
              className="content"
              style={{
                minHeight: "100px",
                display: "block",
                width: "300px",
              }}
            >
              {loading ? (
                <>
                  <img
                    style={{
                      left: "inherit",
                      width: "50px",
                    }}
                    src="https://cdn.pixabay.com/animation/2023/05/02/04/29/04-29-06-428_512.gif"
                    className="overlay-img"
                    alt="Registrando"
                  />

                  <Typography
                    variant="h5"
                    className="title"
                    style={{
                      float: "left",
                      border: "0",
                      width: "auto",
                      margin: "5% 0 0 10%",
                    }}
                  >
                    Registrando
                  </Typography>
                </>
              ) : (
                <>
                  <img
                    src="https://tudosobreap.com.br/assets/images/loading.gif"
                    width="100"
                    alt="Sucesso"
                  />

                  <Typography
                    variant="h2"
                    className="description"
                  >
                    Você foi registrado com Sucesso! <br />
                    Vamos Redirecionar você para página de Administração de
                    imóveis da TSA
                  </Typography>
                </>
              )}
            </div>
          </div>
        </DialogContent>

        <CloseIcon
          className="modal-close"
          onClick={handleClose}
        />
      </Dialog>

      <div className="row center">
        <div
          className="content"
          style={{
            minHeight: "auto",
            display: "block",
          }}
        >
          <div sx={{ width: "100%" }}>
            <Box className="form-left">
              <Typography variant="h5" className="title">
                Venha ser
                <br />
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
              sx={{
                "& > :not(style)": {
                  m: 1,
                  width: "100%",
                },
              }}
              noValidate
              autoComplete="off"
              onSubmit={handleSubmit}
            >
              <Typography variant="h5" className="title">
                <PersonAddAltIcon
                  style={{
                    marginRight: "10px",
                  }}
                />
                Crie Sua Conta
              </Typography>

              <Typography variant="h2" className="description">
                Preencha os dados abaixo para se cadastrar
              </Typography>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                  gap: "16px",
                  width: "100%",
                  boxSizing: "border-box",
                  "@media (max-width: 768px)": {
                    gridTemplateColumns: "minmax(0, 1fr)",
                  },
                }}
              >
                <TextField
                  id="outlined-name"
                  label="Digite seu Nome..."
                  variant="outlined"
                  onChange={handleChange}
                  value={formData.name}
                  name="name"
                  fullWidth
                  sx={{ minWidth: 0 }}
                />

                <TextField
                  id="outlined-surname"
                  label="Digite seu Sobrenome..."
                  variant="outlined"
                  onChange={handleChange}
                  value={formData.surname}
                  name="surname"
                  fullWidth
                  sx={{ minWidth: 0 }}
                />

                <TextField
                  id="outlined-creci"
                  label="Digite seu CRECI..."
                  variant="outlined"
                  onChange={handleChange}
                  value={formData.creci}
                  name="creci"
                  error={
                    formData.creci.length > 0 && !isCreciValid
                  }
                  helperText={
                    formData.creci.length > 0 && !isCreciValid
                      ? "Use o formato 123.456"
                      : ""
                  }
                  fullWidth
                  sx={{ minWidth: 0 }}
                />

                <Box
                  sx={{
                    width: "100%",
                    minWidth: 0,
                    minHeight: "56px",
                    border: "1px solid #c4c4c4",
                    borderRadius: "4px",
                    display: "flex",
                    alignItems: "center",
                    padding: "0 14px",
                    boxSizing: "border-box",
                    position: "relative",
                    transition: "border-color 0.2s ease",
                    "&:hover": {
                      borderColor: "#222",
                    },
                  }}
                >
                  <input
                    id="creci-file"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    style={{
                      display: "none",
                    }}
                  />

                  <label
                    htmlFor="creci-file"
                    style={{
                      width: "100%",
                      minWidth: 0,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "10px",
                    }}
                  >
                    <Typography
                      sx={{
                        color: creciFile ? "#333" : "#666",
                        fontSize: "16px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        minWidth: 0,
                      }}
                    >
                      {creciFile
                        ? creciFile.name
                        : "Credencial do CRECI"}
                    </Typography>

                    <Button
                      component="span"
                      variant="outlined"
                      size="small"
                      sx={{
                        flexShrink: 0,
                      }}
                    >
                      Selecionar
                    </Button>
                  </label>
                </Box>
              </Box>

              <Box
                style={{
                  position: "relative",
                  float: "left",
                  width: "100%",
                }}
              >
                <TextField
                  style={{
                    width: "100%",
                  }}
                  label="Senha"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  type={showPassword ? "text" : "password"}
                  variant="outlined"
                />

                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: "-320px",
                    width: "290px",
                    background: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "12px",
                    padding: "16px",
                    boxShadow: "0 10px 30px rgba(0,0,0,.08)",
                    zIndex: 10,
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: "22px",
                      right: "-10px",
                      width: "18px",
                      height: "18px",
                      background: "#fff",
                      borderTop: "1px solid #e5e7eb",
                      borderRight: "1px solid #e5e7eb",
                      transform: "rotate(45deg)",
                    },
                    "@media (max-width: 768px)": {
                      position: "relative",
                      top: "auto",
                      left: "auto",
                      width: "100%",
                      boxSizing: "border-box",
                      marginTop: "12px",
                      marginBottom: "8px",
                      padding: "14px",
                      "&::before": {
                        display: "none",
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
                    {passwordValidation.minLength ? "✅" : "❌"}{" "}
                    Mínimo de 8 caracteres
                    {!passwordValidation.minLength &&
                      ` (${formData.password.length}/8)`}
                  </div>

                  <div>
                    {passwordValidation.uppercase ? "✅" : "❌"}{" "}
                    Uma letra maiúscula
                  </div>

                  <div>
                    {passwordValidation.lowercase ? "✅" : "❌"}{" "}
                    Uma letra minúscula
                  </div>

                  <div>
                    {passwordValidation.number ? "✅" : "❌"}{" "}
                    Um número
                  </div>

                  <div>
                    {passwordValidation.special ? "✅" : "❌"}{" "}
                    Um caractere especial
                  </div>
                </Box>

                <IconButton
                  aria-label="Alternar visibilidade da senha"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                  style={{
                    position: "absolute",
                    right: "1.2rem",
                    top: "0.5rem",
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
                helperText={
                  erro ? "Por favor, digite um e-mail válido." : ""
                }
              />

              <Typography
                className="ThumbSLider-description"
                gutterBottom
              >
                <Checkbox
                  name="termsAccepted"
                  checked={Boolean(formData.termsAccepted)}
                  onChange={handleChange}
                  inputProps={{
                    "aria-label": "Aceitar termos de uso",
                  }}
                  style={{
                    paddingLeft: "0",
                  }}
                />
                Estando de acordo, você aceita nosso{" "}
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