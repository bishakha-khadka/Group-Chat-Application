import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { io } from "socket.io-client";
import "./App.css";
import Chat from "./components/Chat";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Home from "./components/Home";

const socket = io(process.env.REACT_APP_API_URL, {
  transports: ["websocket", "polling"],
  // withCredentials: true,
});

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Outlet />}>
            <Route index element={<Login socket={socket} />}></Route>
            <Route path="login" element={<Login socket={socket} />}></Route>
            <Route path="home" element={<Home />}></Route>
            <Route path="signup" element={<Signup />}></Route>
            <Route
              path="chat/:roomId"
              element={<Chat socket={socket} />}
            ></Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
