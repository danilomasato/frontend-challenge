import React, { useState } from "react";
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import Stack from '@mui/material/Stack';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Loading } from "../../components/Loading";
import { useDispatch } from 'react-redux';
import * as api from "../../api";
import * as types from "../../constants/ActionTypes";

export default function CustomIcons(props) {
    
  const dispatch = useDispatch();
  const [changePage, setChangePage] = useState(false);

  const handleChange = (event, page) => {
    
    setChangePage(true)

    setTimeout(() => {
      api.getCharacterData(page).then(response => {
         dispatch({
            type: types.RECEIVE_HOME,
            home: response
          })
        setChangePage(false)
      })
    }, 2500);
  };

  return (
    <>
    <Stack spacing={2} className="center" style={{ marginTop: '30px' }}>
      <Pagination
        count={10}
        onChange={handleChange}
        renderItem={(item) => (
          <PaginationItem
            components={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
            {...item} 
          />
        )}
      />
    </Stack>

    { changePage ? 
      <Loading /> : ''
    }
    </>
  );
}
