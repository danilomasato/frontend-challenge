import React from "react";
import "./TopInfo.css";
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';

export const TopInfo = data => {
  
  return (
    <>
      <div className="row" style={{ background: '#0b2c3d', margin: '0' }}>
          <ul className="top-info center">
            <li><MailOutlineIcon className="icon"/><span>tudosobreape@gmail.com</span></li>
            <li><LocationOnIcon className="icon"/><span>Rua Cassino, 13 - Jardim dos Lagos - São Paulo - SP, 04771-010</span></li>
            <li className="CRECI"><span>CRECI:47289J</span></li>
            <li><a href=""><FacebookIcon className="icon icon-face"/></a></li>
            <li><a href=""><InstagramIcon className="icon icon-insta"/></a></li>
          </ul>
      </div>
    </>
  );
};

export default TopInfo;
