import React from "react";
import "./Footer.css";

export const Footer = data => {
  return (
    <>
      <div className="row" className="footer">
        <footer>
          <div class="container-footer">
              <div class="row-footer">
                  
                  <div class="footer-col">
                      <h4>Empresa</h4>
                      <ul>
                          <li><a href="#"> Quem somos </a></li>
                          <li><a href=""> nossos serviços </a></li>
                          <li><a href=""> política de privacidade </a></li>
                          <li><a href=""> programa de afiliados</a></li>
                      </ul>
                  </div>
                 
                  <div class="footer-col">
                      <h4>Obter ajuda</h4>
                      <ul>
                          <li><a href="#">FAQ</a></li>
                          <li><a href="#">Transporte</a></li>
                          <li><a href="#">devoluções</a></li>
                          <li><a href="#">Status De Pedido</a></li>
                          <li><a href="#">Opções De Pagamento</a></li>
                      </ul>
                  </div>
                
                  <div class="footer-col">
                      <h4>Loja online</h4>
                      <ul>
                          <li><a href="#">Relógio</a></li>
                          <li><a href="#">Saco</a></li>
                          <li><a href="#">Calçado</a></li>
                          <li><a href="#">Endereço</a></li>
                      </ul>
                  </div>
                  
                  <div class="footer-col">
                      <h4>Se subescreva!</h4>
                      <div class="form-sub">
                          <form>
                              <input type="email" placeholder="Digite o seu e-mail" required />
                              <button>subscrever</button>
                          </form>
                      </div>

                      <div class="medias-socias">
                          <a href="#"> <i class="fa fa-facebook"></i> </a>
                          <a href="#"> <i class="fa fa-instagram"></i> </a>
                          <a href="#"> <i class="fa fa-twitter"></i> </a>
                          <a href="#"> <i class="fa fa-linkedin"></i> </a>
                      </div>

                  </div>
              </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Footer;
