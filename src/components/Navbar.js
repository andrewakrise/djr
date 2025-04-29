import { Box, Grid, Link } from "@mui/material";
import { Facebook, Instagram } from "@mui/icons-material";
import mixcloudIcon from "../assets/icons/mixcloud.png";
import vimeoIcon from "../assets/icons/vimeo.png";

const Navbar = () => {
  return (
    <Grid
      container
      sx={{
        p: "calc(5px + 1vmin)",
        flexGrow: 1,
        minHeight: "100%",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Grid item xs={2}>
        <Box
          sx={{
            display: "flex",
            justifyContent: { xs: "center" },
            fontSize: "calc(10px + 2vmin)",
            mb: { xs: 1 },
          }}
        >
          <Link
            href="https://www.facebook.com/andrewrisedj/"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              color: "#282c34",
              textDecoration: "none",
              ":hover": {
                color: "#037392",
                textDecoration: "underline",
              },
            }}
          >
            <Facebook sx={{ width: "auto", height: "calc(2rem + 4vmin)" }} />
          </Link>
        </Box>
      </Grid>
      <Grid item xs={2}>
        <Box
          sx={{
            display: "flex",
            justifyContent: { xs: "center" },
            fontSize: "calc(10px + 2vmin)",
            mb: { xs: 1 },
          }}
        >
          <Link
            href="https://www.instagram.com/vandjrise/"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              color: "#282c34",
              textDecoration: "none",
              ":hover": {
                color: "#037392",
                textDecoration: "underline",
              },
            }}
          >
            <Instagram sx={{ width: "auto", height: "calc(2rem + 4vmin)" }} />
          </Link>
        </Box>
      </Grid>
      <Grid item xs={2}>
        <Box
          sx={{
            display: "flex",
            justifyContent: { xs: "center" },
            fontSize: "calc(10px + 2vmin)",
            mb: { xs: 1 },
          }}
        >
          <Link
            href="https://vimeo.com/risedj/"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              color: "#282c34",
              textDecoration: "none",
              ":hover": {
                color: "#037392",
                textDecoration: "underline",
              },
            }}
          >
            <Box
              component="img"
              src={vimeoIcon}
              alt="Vimeo"
              sx={{ width: "auto", height: "calc(2rem + 4vmin)" }}
            />
          </Link>
        </Box>
      </Grid>
      <Grid item xs={2}>
        <Box
          sx={{
            display: "flex",
            justifyContent: { xs: "center" },
            fontSize: "calc(10px + 2vmin)",
            mb: { xs: 1 },
          }}
        >
          <Link
            href="https://www.mixcloud.com/vandjrise/"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              color: "#282c34",
              textDecoration: "none",
              ":hover": {
                color: "#037392",
                textDecoration: "underline",
              },
            }}
          >
            <Box
              component="img"
              src={mixcloudIcon}
              alt="Mixcloud"
              sx={{ width: "auto", height: "calc(2rem + 5vmin)" }}
            />
          </Link>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Navbar;
