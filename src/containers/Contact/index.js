import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import "./Contact.css";
import { Header } from "../../components/Header";
import { TopInfo } from "../../components/TopInfo";
import { TopHeader } from "../../components/TopHeader";
import { Footer } from "../../components/Footer";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import SendIcon from "@mui/icons-material/Send";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import CloseIcon from "@mui/icons-material/Close";

const Contact = ({ props }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [contact, SetContact] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!contact.name.trim()) {
      setError("Digite seu nome.");
      return;
    }

    if (!contact.email.trim()) {
      setError("Digite seu e-mail.");
      return;
    }

    if (!contact.message.trim()) {
      setError("Digite uma mensagem.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(contact.email)) {
      setError("Digite um e-mail válido.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/dispatch.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contact),
      });

      const data = await response.json();

      if (data.success) {
        setOpen(true);

        SetContact({
          name: "",
          email: "",
          message: "",
        });

        setTimeout(() => {
          setOpen(false);
        }, 3000);
      } else {
        setError(
          data.message || "Não foi possível enviar sua mensagem. Tente novamente."
        );
      }
    } catch (error) {
      console.error("Erro ao enviar formulário:", error);
      setError(
        "Não foi possível enviar sua mensagem. Verifique sua conexão e tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <TopInfo />
      <Header />

      <div id="contact" className="row center">
        <div
          className="content"
          style={{
            minHeight: "auto",
            display: "block",
          }}
        >
          <Box sx={{ width: "100%" }}>
            <Typography className="title" variant="h5" gutterBottom>
              Fale Conosco
            </Typography>
          </Box>

          <br />

          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3653.9601015474373!2d-46.71441682392875!3d-23.677384778720306!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce51cc54634aaf%3A0x1b38a6c93014816c!2sR.%20Cassino%2C%2013%20-%20Jardim%20dos%20Lagos%2C%20S%C3%A3o%20Paulo%20-%20SP%2C%2004768-200!5e0!3m2!1spt-BR!2sbr!4v1763751155851!5m2!1spt-BR!2sbr"
            width="450"
            height="450"
            style={{ border: "0" }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Localização TSA Imóveis"
          />

          <div className="form">
            <Box
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
              <TextField
                value={contact.name}
                onChange={(e) =>
                  SetContact({
                    ...contact,
                    name: e.target.value,
                  })
                }
                id="contact-name"
                label="Digite seu Nome..."
                variant="outlined"
              />

              <TextField
                value={contact.email}
                onChange={(e) =>
                  SetContact({
                    ...contact,
                    email: e.target.value,
                  })
                }
                id="contact-email"
                label="Digite seu Email..."
                variant="outlined"
                type="email"
              />

              <TextField
                value={contact.message}
                onChange={(e) =>
                  SetContact({
                    ...contact,
                    message: e.target.value,
                  })
                }
                id="contact-message"
                label="Como podemos Ajudar?"
                multiline
                rows={4}
              />

              {error && (
                <Typography
                  sx={{
                    color: "red",
                    fontSize: "14px",
                    margin: "10px !important",
                  }}
                >
                  {error}
                </Typography>
              )}

              <Button
                type="submit"
                variant="contained"
                endIcon={<SendIcon />}
                disabled={loading}
              >
                {loading ? "Enviando..." : "Enviar"}
              </Button>
            </Box>
          </div>
        </div>
      </div>

      <Footer />

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
            <div
              className="content"
              style={{
                minHeight: "auto",
                display: "block",
                width: "500px",
              }}
            >
              <img
                src="https://tudosobreap.com.br/assets/images/loading.gif"
                width="100"
                alt="Mensagem enviada"
              />

              <Typography variant="h2" className="description">
                Enviado com Sucesso! <br />
                A TSA retornará em breve!
              </Typography>
            </div>
          </div>
        </DialogContent>

        <CloseIcon className="modal-close" onClick={handleClose} />
      </Dialog>
    </React.Fragment>
  );
};

export default Contact;