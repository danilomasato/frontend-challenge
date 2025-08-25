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
              image={`${baseURL}${characterDetail.cover.url}`}
              alt={characterDetail.slug}
              title={characterDetail.slug}
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {characterDetail.title} 
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {characterDetail.description} <b style={{ fontWeight: 600 }}>{characterDetail.id} </b>
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
    </>
  );
}