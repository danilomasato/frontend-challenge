import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';

export default function MultiActionAreaCard(props) {

  const baseURL = process.env.REACT_APP_URL;
  const characterDetail = props.data.characterDetail[0]

  return (
    <>
        <Card sx={{ maxWidth: 345 }} >
          <CardActionArea>
            <CardMedia
              component="img"
              height="140"
              image={`${baseURL}${characterDetail.fotos.url}`}
              alt={characterDetail.imovel}
              title={characterDetail.imovel}
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {characterDetail.imovel} 
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {characterDetail.descricao} <b style={{ fontWeight: 600 }}>{characterDetail.id} </b>
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
    </>
  );
}