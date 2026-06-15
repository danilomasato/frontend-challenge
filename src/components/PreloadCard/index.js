import React from "react";

export const PreloadCard = data => {
  return (
    <>
      <svg width="400" height="340" viewBox="0 0 400 340" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ 
        boxShadow: '0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12)',
        borderRadius: '10px'
        }}>
        <defs>
          <linearGradient id="shimmer">
            <stop offset="0%" stop-color="#F2F3F5"/>
            <stop offset="50%" stop-color="#E4E7EB"/>
            <stop offset="100%" stop-color="#F2F3F5"/>
            <animateTransform
              attributeName="gradientTransform"
              type="translate"
              values="-1 0; 1 0; -1 0"
              dur="1.5s"
              repeatCount="indefinite"/>
          </linearGradient>
        </defs>

        {/* <!-- Card --> */}
        <rect width="400" height="340" rx="12" fill="#FFFFFF" stroke="#E5E7EB"/>

        {/* <!-- Imagem --> */}
        <rect x="0" y="0" width="400" height="205" rx="12" fill="url(#shimmer)"/>

        {/* <!-- Badge --> */}
        <rect x="16" y="16" width="88" height="26" rx="13" fill="url(#shimmer)"/>

        {/* <!-- Setas --> */}
        <circle cx="28" cy="98" r="17" fill="rgba(255,255,255,0.5)"/>
        <circle cx="372" cy="98" r="17" fill="rgba(255,255,255,0.5)"/>

        {/* <!-- Dots --> */}
        <circle cx="118" cy="182" r="3" fill="#D1D5DB"/>
        <circle cx="136" cy="182" r="3" fill="#D1D5DB"/>
        <circle cx="154" cy="182" r="3" fill="#D1D5DB"/>
        <circle cx="172" cy="182" r="3" fill="#D1D5DB"/>
        <circle cx="190" cy="182" r="3" fill="#D1D5DB"/>
        <circle cx="208" cy="182" r="3" fill="#D1D5DB"/>
        <circle cx="226" cy="182" r="3" fill="#D1D5DB"/>
        <circle cx="244" cy="182" r="3" fill="#D1D5DB"/>
        <circle cx="262" cy="182" r="3" fill="#D1D5DB"/>
        <circle cx="280" cy="182" r="3" fill="#D1D5DB"/>

        {/* <!-- Título --> */}
        <rect x="18" y="220" width="230" height="20" rx="6" fill="url(#shimmer)"/>

        {/* <!-- Localização --> */}
        <rect x="18" y="250" width="150" height="14" rx="5" fill="url(#shimmer)"/>

        {/* <!-- Preço --> */}
        <rect x="18" y="280" width="120" height="24" rx="6" fill="url(#shimmer)"/>

        {/* <!-- Ícones --> */}
        <rect x="18" y="314" width="24" height="12" rx="4" fill="url(#shimmer)"/>
        <rect x="58" y="314" width="24" height="12" rx="4" fill="url(#shimmer)"/>
        <rect x="98" y="314" width="24" height="12" rx="4" fill="url(#shimmer)"/>

        {/* <!-- Botão --> */}
        <rect x="290" y="286" width="92" height="42" rx="8" fill="url(#shimmer)"/>
      </svg>
    </>
  );
};

export default PreloadCard;