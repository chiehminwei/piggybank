import { Routes, Route, Link } from "react-router-dom";
import Home from './Home';
import Deposit from './Deposit';
import Lottery from './Lottery';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './utils/firebase';


function App() {

  const [user, loading, error] = useAuthState(auth);
  
  return (
    <div>
      <Routes>
        {user && <Route path='deposit/:currency' element={<Deposit />}/>}
        {user &&  <Route path='lottery' element={<Lottery />}/> }
        <Route path='/' element={<Home />}/>
      </Routes>
    </div>

  );
}

export default App;
