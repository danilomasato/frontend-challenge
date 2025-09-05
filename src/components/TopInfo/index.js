import React from "react";
import "./TopInfo.css";
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import LocationOnIcon from '@mui/icons-material/LocationOn';

export const TopInfo = data => {
  
  return (
    <>
      <div className="row" style={{ background: '#0b2c3d', margin: '0' }}>
          <ul className="top-info center">
            <li><MailOutlineIcon className="icon"/><span>tudosobreape@gmail.com</span></li>
            <li><LocationOnIcon className="icon"/><span>Av. do Rio Bonito, 162 São Paulo - SP, 04776-000</span></li>
          </ul>
      </div>
    </>
  );
};

export default TopInfo;
