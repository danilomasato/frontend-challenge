import React from "react";
import "./Footer.css";

export const Footer = data => {
  return (
    <>
      <div className="row" className="footer">
        <footer>
          <div className="container-footer">
              <div className="row-footer">
                  
                  <div className="footer-col">
                      <h4>Empresa</h4>
                      <ul>
                          <li><a href="http://f12-preview.awardspace.net/tudosobreap.com/#/sobre-nos"> Quem somos </a></li>
                          <li><a href="http://f12-preview.awardspace.net/tudosobreap.com/#/contato"> Fale Conosco </a></li>
                      </ul>
                  </div>
                 
                  <div className="footer-col">
                      <h4>Obter ajuda</h4>
                      <ul>
                          <li><a href="#">FAQ</a></li>
                      </ul>
                  </div>
                
                  <div className="footer-col">
                      <h4>Afiliados</h4>
                      <ul>
                          <li><a href="https://sublime-bat-ad2fca1255.strapiapp.com/admin/auth/login"> Acesso para Corretores </a></li>
                          
                      </ul>
                  </div>
                  
                  <div className="footer-col">
                      <h4>Medias Socias</h4>

                      <div className="medias-socias">
                          <a href="#"> <i className="fa fa-facebook"></i> </a>
                          <a href="#"> <i className="fa fa-instagram"></i> </a>
                          <a href="#"> <i className="fa fa-twitter"></i> </a>
                          <a href="#"> <i className="fa fa-linkedin"></i> </a>
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
