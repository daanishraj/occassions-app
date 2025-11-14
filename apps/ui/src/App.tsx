import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import About from "./pages/about";
import Landing from "./pages/landing";
import Login from "./pages/login";
import PageNotFound from "./pages/not-found";
import Occassions from "./pages/occassions";

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={
            <>
            <SignedOut>
              <Landing />
            </SignedOut>
            <SignedIn>
              <Navigate to="/occasions" />
            </SignedIn>
            </>
            } />
          <Route path="/login" element={
            <>
            <SignedOut>
              <Login />
            </SignedOut>
            <SignedIn>
              <Navigate to="/occasions" />
            </SignedIn>
            </>
            } />
          <Route path="/about" element={<About />} />
          <Route path="/occasions" element={
            <SignedIn>
            <Occassions />
            </SignedIn>
            } />
          <Route path="/index.html" element={<Navigate to="/" replace />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
