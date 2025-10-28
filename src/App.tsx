import { Routes, Route } from "react-router-dom";
import SignInPage from "./pages/SignIn";
import HomePage from "./pages/Home";
import SignUpPage from "./pages/SignUp";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<SignInPage />} />
      <Route path="/signup" element={<SignUpPage />} />
    </Routes>
  );
}

export default App;
