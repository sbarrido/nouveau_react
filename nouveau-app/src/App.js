import logo from './logo.svg';
import './App.css';
import {Button} from 'reactstrap'
import {Link} from "react-router-dom";


function App() {
  return (
    <div className="App">
        <h1>Landing page</h1>
        <Link to={"/Registration"}>
          <Button>register</Button>
        </Link>
    </div>
  );
}

export default App;
