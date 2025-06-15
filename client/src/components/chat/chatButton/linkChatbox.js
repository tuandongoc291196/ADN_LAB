import { AuthenticatedApp } from "../authenticatedApp/index.js";
import { UnauthenticatedApp } from "../unauthenticatedApp/index.js";
import { useAuth } from "../../hooks/useAuth.js";
import { Box } from "@mui/material";

function LinkChatbox() {
  const { user } = useAuth();

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      
    >
      <h1>Chat Room</h1>
      {user ? <AuthenticatedApp /> : <UnauthenticatedApp />}
    </Box>
  );
}

export default LinkChatbox;
