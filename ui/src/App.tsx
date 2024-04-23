import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import UserAvatar from "./components/avatar";
import PageNotFound from "./pages/not-found";
import Occassions from "./pages/occassions";
import Profile from "./pages/profile";
const App = () => {
  return (
    <>
      <UserAvatar />
      <Router>
        <Routes>
          <Route path="/" element={<Occassions />} />
          <Route path="/occasions" element={<Occassions />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
