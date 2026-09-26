import React from "react";

export const Loading = ({ isPageChange = false }) => {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: isPageChange
          ? "rgba(255, 255, 255, 0.72)"
          : "rgba(255, 255, 255, 0.4)",
      }}
    >
      <svg
        width="100"
        height="100"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Carregando"
        role="img"
      >
        <defs>

          {/* Gradiente de cor */}
          <linearGradient
            id="loadingColor"
            x1="15%"
            y1="15%"
            x2="85%"
            y2="85%"
          >
            <stop
              offset="0%"
              stopColor="#16c4f3"
            />

            <stop
              offset="48%"
              stopColor="#6262ff"
            />

            <stop
              offset="75%"
              stopColor="#7b2cff"
            />

            <stop
              offset="100%"
              stopColor="#a020f0"
            />
          </linearGradient>


          {/* Gradiente para afinar as pontas */}
          <linearGradient
            id="loadingTipFade"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop
              offset="0%"
              stopColor="white"
              stopOpacity="0"
            />

            <stop
              offset="12%"
              stopColor="white"
              stopOpacity="1"
            />

            <stop
              offset="88%"
              stopColor="white"
              stopOpacity="1"
            />

            <stop
              offset="100%"
              stopColor="white"
              stopOpacity="0"
            />
          </linearGradient>


          <mask id="loadingTipMask">

            <circle
              cx="50"
              cy="50"
              r="32"
              fill="none"
              stroke="url(#loadingTipFade)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray="65 136"
            />

          </mask>

        </defs>


        {/* CÍRCULO DE FUNDO */}
        <circle
          cx="50"
          cy="50"
          r="32"
          fill="none"
          stroke="#555"
          strokeWidth="2"
          opacity="0.14"
        />


        {/* ARCO ANIMADO */}
        <g>

          <circle
            cx="50"
            cy="50"
            r="32"
            fill="none"
            stroke="url(#loadingColor)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="65 136"
            mask="url(#loadingTipMask)"
          />


          <animateTransform
            attributeName="transform"
            attributeType="XML"
            type="rotate"
            from="0 50 50"
            to="360 50 50"
            dur="1s"
            repeatCount="indefinite"
          />

        </g>


        {/* EDIFÍCIO MINIMALISTA */}
        <g
          fill="none"
          stroke="#555"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.5"
        >

          {/* Estrutura do edifício */}
          <path d="M41 61 V45 L50 40 L59 45 V61" />

          {/* Base */}
          <path d="M39 61 H61" />

          {/* Divisões / janelas */}
          <path d="M45 48 V51" />
          <path d="M50 47 V51" />
          <path d="M55 48 V51" />

          <path d="M45 55 V58" />
          <path d="M50 54 V58" />
          <path d="M55 55 V58" />

        </g>

      </svg>

    </div>
  );
};


export default Loading;