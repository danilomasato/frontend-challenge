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
                          
                      </ul>
                  </div>
                 
                  <div class="footer-col">
                      <h4>Obter ajuda</h4>
                      <ul>
                          <li><a href="#">FAQ</a></li>
                          <li><a href="#">Opções De Pagamento</a></li>
                      </ul>
                  </div>
                
                  <div class="footer-col">
                      <h4>Afiliados</h4>
                      <ul>
                          <li><a href=""> programa de afiliados</a></li>
                          <li><a href="#"> Venha ser um Corretor </a></li>
                      </ul>
                  </div>
                  
                  <div class="footer-col">
                      <h4>Medias Socias</h4>

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
