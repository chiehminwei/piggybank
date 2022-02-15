import logo from './logo.svg';
import kiss from './assets/kiss.gif';
import bunny from './assets/bunny.png';
import piggy from './assets/piggy.png';
import box from './assets/mystery-box.png';
import './App.css';
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"
import { SimpleGrid } from '@chakra-ui/react'
import { Button, Container, Text } from '@chakra-ui/react'
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
import { GoogleAuthProvider, signOut, signInWithPopup } from 'firebase/auth';
import { auth, db } from './utils/firebase';
import { query, orderBy, limit, collection } from "firebase/firestore";


const Action = ({ nav, src, text }) => (
  <motion.button 
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    onClick={nav} 
    style={{ padding: 30 }}>
    <img style={{width: 300}} src={src} alt="bunny" />
    <h3>{text}</h3>
  </motion.button>
)

const provider = new GoogleAuthProvider()
provider.addScope('https://www.googleapis.com/auth/contacts.readonly');

const login = () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      // ...
    }).catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
    });
};
const logout = () => {
  signOut(auth);
};

const LoginButton = () => (
  <Button colorScheme='teal' variant='solid' onClick={login}>
    登入
  </Button>
)

const Announcement = () => {
  

  const depositsRef = collection(db, 'deposits')
  // const q = query(depositsRef, orderBy("createdAt"), limit(20));
  const q = query(depositsRef, limit(20));


  const [deposits, loading, error] = useCollection(
    q,
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );

  const announcement = '📢扑满及时快讯📢'

  return (
    <>
      <Text>{announcement}</Text>
      {
      deposits && deposits.docs.map(doc => {
        const { createdAt, description, currency, userId, amount } = doc.data()
        const date = createdAt.toDate()
        const dateStr = date.toISOString().split('T')[0]
        const time = date.toLocaleTimeString('en-US')

        
        const userName = userId === 'X9kKL6ATSRWBuD8LMzXHMUbdzGa2' ? '屁屁猪' : '屁屁兔'
        
        return (
          <div style={{ border: '1px solid white', margin: 30 }}>
            <Text>
              {`${userName}在${dateStr}的${time}获得了${amount}个${currency}！`}
            </Text>
            <Text>
              {`他记录的好事：${description}`}
            </Text>
          </div>
        )
      })
      }
    </>
  )
}

function Home() {
  const navigate = useNavigate(); 
  const [user, loading, error] = useAuthState(auth);

  const welcomeText = '欢迎来到猪猪兔兔扑满！希望今天也有好事发生哟😘'
  const saveBunny = '存入兔兔币🐰！'
  const savePiggy = '存入猪猪币🐷！'
  const lottery = '抽奖去🎉🎉🎉'
  
  

  return (
    <div className="App">
      <div className="Container">
        <img style={{ height: 400 }} src={kiss} alt="bunny_and_piggy" />
        <p>
          {welcomeText}
        </p>
        {!user && <LoginButton/>}
        { user && (
        <SimpleGrid columns={{sm: 1, md: 3}} spacing='30px'>
          <Action
            src={bunny}
            text={saveBunny}
            nav={() => navigate('/deposit/兔兔币🐰')}
          />
          <Action
            src={piggy}
            text={savePiggy}
            nav={() => navigate('/deposit/猪猪币🐷')}
          />
          <Action
            src={box}
            text={lottery}
            nav={() => navigate('/lottery')}
          />          
        </SimpleGrid>  
        )
        }
        <Announcement/>
      </div>
    </div>
  );
}

export default Home;
