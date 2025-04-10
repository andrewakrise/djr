import { Box, Grid, Link } from "@mui/material";
import { Facebook, Instagram, YouTube } from "@mui/icons-material";
import mixcloudSVGIcon from "../../assets/icons/mixcloud-svgrepo-com.svg";
import vimeoSVGIcon from "../../assets/icons/vimeo-vimeo-svgrepo-com.svg";

const IconLinks = () => {
  return (
    <Grid
      container
      sx={{
        p: "calc(5px + 1vmin)",
        flexGrow: 1,
        gap: "1rem",
        maxWidth: "20rem",
        width: "100%",
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
            fontSize: "calc(10px + 1vmin)",
            mb: { xs: 1 },
          }}
        >
          <Link
            href="https://www.mixcloud.com/andrewrisedj/"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              color: "#FFF",
              textDecoration: "none",
            }}
          >
            <Box
              component="img"
              src={mixcloudSVGIcon}
              alt="Mixcloud"
              sx={{ width: "auto", height: "calc(1rem + 4vmin)" }}
            />
          </Link>
        </Box>
      </Grid>
      <Grid item xs={2}>
        <Box
          sx={{
            display: "flex",
            justifyContent: { xs: "center" },
            fontSize: "calc(10px + 1vmin)",
            mb: { xs: 1 },
          }}
        >
          <Link
            href="https://www.facebook.com/andrewrisedj/"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              color: "#FFF",
              textDecoration: "none",
            }}
          >
            <Facebook sx={{ width: "auto", height: "calc(1rem + 3vmin)" }} />
          </Link>
        </Box>
      </Grid>
      <Grid item xs={2}>
        <Box
          sx={{
            display: "flex",
            justifyContent: { xs: "center" },
            fontSize: "calc(10px + 1vmin)",
            mb: { xs: 1 },
          }}
        >
          <Link
            href="https://www.instagram.com/vandjrise/"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              color: "#FFF",
              textDecoration: "none",
            }}
          >
            <Instagram sx={{ width: "auto", height: "calc(1rem + 3vmin)" }} />
          </Link>
        </Box>
      </Grid>
      <Grid item xs={2}>
        <Box
          sx={{
            display: "flex",
            justifyContent: { xs: "center" },
            fontSize: "calc(10px + 1vmin)",
            mb: { xs: 1 },
          }}
        >
          <Link
            href="https://www.youtube.com/@vandjrise/"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              color: "#FFF",
              textDecoration: "none",
            }}
          >
            <YouTube sx={{ width: "auto", height: "calc(1.7rem + 3vmin)" }} />
          </Link>
        </Box>
      </Grid>
    </Grid>
  );
};

export default IconLinks;
