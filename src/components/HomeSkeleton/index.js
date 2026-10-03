import React from "react";

import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";

import { styled } from "@mui/material/styles";

import PreloadCard from "../../components/PreloadCard";

const Root = styled("div")(({ theme }) => ({
  width: "100%",
  ...theme.typography.body2,
  color: (theme.vars || theme).palette.text.secondary,

  "& > :not(style) ~ :not(style)": {
    marginTop: theme.spacing(2),
  },
}));

const HomeSkeleton = ({
  configPreload = 6
}) => {

  return (

    <>

      <Root>

        <Divider
          className="divider"
        >

          <Chip
            className="divider-chip"
            label="Imóveis à Venda"
            size="small"
          />

        </Divider>

      </Root>

      <Box
        id="preload"
        className="preload"
      >

        {Array.from({
          length: configPreload
        }).map((_, index) => (

          <PreloadCard
            key={`preload-${index}`}
          />

        ))}

      </Box>

    </>

  );

};

export default HomeSkeleton;