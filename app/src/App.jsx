import Navbar from './Header/Navbar';
import './App.css';
import Body from './Body/Body';
import axios from 'axios';

function App() {
  axios.defaults.baseURL = 'http://localhost:4001/api/v1/';
  axios.defaults.headers.post['Content-Type'] = 'application/json';
  axios.defaults.headers.common[
    'Authorization'
  ] = `Bearer ${localStorage.token}`;

  return (
    <div className="App bg-serenity-pink-secondary">
      <Navbar />
      <Body />
    </div>
  );
}

export default App;
