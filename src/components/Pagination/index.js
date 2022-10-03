import React from 'react';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import Stack from '@mui/material/Stack';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import { useDispatch } from 'react-redux';
import * as api from "../../api";
import * as types from "../../constants/ActionTypes";

export default function CustomIcons(props) {
    
  const dispatch = useDispatch();

  const handleChange = (event, page) => {
    api.getCharacterData(page).then(response =>
      dispatch({
        type: types.RECEIVE_HOME,
        home: response
      })
    );
  };

  return (
    <Stack spacing={2} className="center">
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
  );
}
