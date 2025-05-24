import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/elements/Layout';
import Homepage from './components/pages/Homepage';
import Login from './components/pages/Login';
import Register from './components/pages/Register';
import Profile from './components/pages/Profile';
import Settings from './components/pages/Settings';
import Dashboard from './components/pages/Dashboard';
import Feedback from './components/pages/Feedback';
import Myruns from './components/pages/Myruns';
import Myplaylists from './components/pages/Myplaylists';

function App() {
  return (
    <Router>
      <Routes>
        {/* Pagini fără NavBar */}
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Pagini cu NavBar */}
        <Route element={<Layout />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/myruns" element={<Myruns />} />
          <Route path="/myplaylists" element={<Myplaylists />} />
        </Route>
      </Routes>
    </Router>
  );
}

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Homepage />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<Register />} />
//       </Routes>
//     </Router>
//   )
// }


// function App() {
//   return (
//     <div className="App">
//     <Appbar/>
//     <Runner/>
//     </div>
//   );
// }

export default App;
