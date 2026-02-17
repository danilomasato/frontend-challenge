import React, { useEffect  } from 'react';
import "./CustomerTestimonials.css";
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

const baseURL = process.env.REACT_APP_URL;

export const CustomerTestimonials  = () => {

  return (
    <>
      <div className='CustomerTestimonials'>
        <svg className='separator' width="151" height="29" viewBox="0 0 151 29">
          <g clip-path="url(#prefix__a)">
            <path d="M.022-.185v.261C.233.055 21.201-1.916 35.27 9.101c1.173.92 2.407 1.955 3.713 3.051 7.853 6.6 18.584 15.578 36.318 15.831a3.954 3.954 0 00.753 0c17.733-.253 28.463-9.235 36.319-15.831 1.3-1.1 2.537-2.131 3.71-3.051C130.152-1.919 151.339.112 151.339.112v-.3c-.062-.006-1.828 0-4.687 0" fill="#fff"></path><path d="M82.283 8.574l-6.727 6.729-6.735-6.736a.659.659 0 00-.453-.17.622.622 0 00-.438.2.636.636 0 00.006.869l7.179 7.177a.532.532 0 00.212.121.611.611 0 00.241.049.635.635 0 00.441-.179l7.165-7.167a.63.63 0 000-.893.645.645 0 00-.891 0z" fill="#1e2126">
            </path>
            </g>
        </svg>

        <div className="row center">
          <h2>Veja os depoimentos dos nossos clientes</h2>
          <Card className="CustomerTestimonials-card" sx={{ maxWidth: 345 }}>
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: '#ccc' }} aria-label="recipe">
                  B
                </Avatar>
              }
              title="Brenda Queiroz"
              subheader="Setembro 14, 2013"
            />
            <CardContent>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                ”Alugamos nosso apartamento através da Vânia e do Cléber e podemos dizer que sem eles isso não seria possível, 
                nos auxiliaram e prestaram todo atendimento da melhor maneira possível, 
                com profissionalismo e humanidade sem tamanho, somos mto gratos por tudo que fizeram para que esse processo fosse 
                o menos burocrático e cansativo.  Estamos muito felizes com a nossa locação, e a Vânia sempre nos presta 
                quaisquer atenção todas as vezes que necessário. 
                Indico e confio de olhos fechados. Muito obrigada.”
              </Typography>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

export default CustomerTestimonials;
