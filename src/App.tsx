/**
 * App component: Main UI for the forklift controller.
 * - Handles API IP validation and connection.
 * - Renders Throttle, Gas, and SteeringWheel controls.
 * - Sends control values to the backend API.
 * - Responsive to screen orientation.
 */

import {
  Dialog,
  IconButton,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import SteeringWheel from "./components/steering-wheel";
import { useState } from "react";
import { useScreenOrientation } from "./hook/checkScreen";
import Throttle from "./components/throttle";
import Gas from "./components/gas";
import RightIcon from "./assets/right-arrow-svgrepo-com.svg";
function isValidApiIp(ip: string): boolean {
  // IPv4 regex
  const ipv4 =
    /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  // IPv6 regex (simple version)
  const ipv6 = /^([\\da-fA-F]{1,4}:){7}[\\da-fA-F]{1,4}$/;
  return ipv4.test(ip) || ipv6.test(ip);
}

const checkIp = (ip: string) => {
  try {
    const url = new URL(ip);
    return isValidApiIp(url.hostname);
  } catch (error) {
    console.error("Error fetching IP:", error);
    return false;
  }
};

function App() {
  const [API_IP, setAPI_IP] = useState("");
  const [formApi, setFormApi] = useState("");

  const checkScreenOrientation = useScreenOrientation();

  const [, setThrottle] = useState(0);
  const handleThrottleChange = (th: number) => {
    fetch(`${API_IP}/setThrottle1?value=${th}`);
    setThrottle(th);
  };

  const [, setSteeringAngle] = useState(0);

  const handleSteeringChange = (angle: number) => {
    console.log("Current steering angle:", angle);
    fetch(`${API_IP}/setSteering?value=${angle}`);
    setSteeringAngle(angle);
  };

  const [gasPedal, setGasPedal] = useState(0);

  const handleGasPedalChange = (active: number) => {
    console.log("Current gas pedal:", active);
    fetch(`${API_IP}/setThrottle2?value=${active}`);
    setGasPedal(active);
  };

  const isIpValid = checkIp(API_IP);

  return checkScreenOrientation === "landscape" ? (
    !isIpValid ? (
      <Dialog
        open={true}
        sx={{
          ".MuiPaper-root": {
            padding: "12px 24px",
          },
        }}
      >
        <Typography
          variant="h6"
          align="center"
          fontWeight={"600"}
          letterSpacing={-0.5}
        >
          Hey Welcome to Forklift Controller!
        </Typography>
        <Typography
          variant="body2"
          letterSpacing={-0.2}
          sx={{
            marginBottom: "1rem",
          }}
        >
          Enter the IP address of your forklift's API server in the
        </Typography>
        <TextField
          variant="outlined"
          value={formApi}
          onChange={(e) => setFormApi(e.target.value)}
          placeholder="API IP Address"
          fullWidth
          helperText={
            "You can get this IP address from Arduino IDE or the output of the serial monitor."
          }
          slotProps={{
            input: {
              endAdornment: (
                <IconButton
                  disabled={!checkIp(formApi)}
                  onClick={() => {
                    if (checkIp(formApi)) {
                      // Proceed with the valid IP
                      console.log("Valid IP entered:", formApi);
                      setAPI_IP(formApi);
                    } else {
                      // Show an error message
                      console.error("Invalid IP entered:", formApi);
                    }
                  }}
                  sx={{
                    "& img": {
                      filter: checkIp(formApi) ? "none" : "invert(100%)",
                    },
                  }}
                >
                  <img src={RightIcon} width={24} height={24} />
                </IconButton>
              ),
            },
          }}
        />
      </Dialog>
    ) : (
      <Container>
        <div></div>
        <Control>
          <ControlContainer>
            <Throttle onChange={handleThrottleChange} />
            <Gas onChange={handleGasPedalChange} value={gasPedal} />
          </ControlContainer>
          <SteeringWheel onChange={handleSteeringChange} min={-60} max={60} />
        </Control>
      </Container>
    )
  ) : (
    <Container>
      <Typography variant="h6" align="center" sx={{ mt: 4 }}>
        This app is much more interactive in landscape mode. Please rotate your
        device.
      </Typography>
    </Container>
  );
}

export default App;

const Container = styled("div")({
  width: "100%",
  height: "100dvh",
  display: "grid",
  gridTemplateColumns: "1fr",
  gridTemplateRows: "1fr auto",
});

const Control = styled("div")({
  display: "grid",
  gridTemplateColumns: "1fr auto",
  gridTemplateRows: "1fr auto",
  padding: "32px",
});

const ControlContainer = styled("div")({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-end",
  alignItems: "flex-start",
  gap: "12px",
});
