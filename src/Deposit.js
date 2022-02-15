import { useParams } from "react-router-dom";
import { Heading, Text, Textarea, Input, Container, AspectRatio, Image, Button } from '@chakra-ui/react'
import { ArrowBackIcon } from '@chakra-ui/icons'
import { useNavigate } from "react-router-dom";
import piggygif from './assets/piggygif.gif'
import bunnygif from './assets/bunnygif.gif'
import { collection, addDoc } from 'firebase/firestore';
import { useCollection } from 'react-firebase-hooks/firestore';
import { db, auth } from './utils/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useState } from 'react';
import { useToast } from '@chakra-ui/react'
import { serverTimestamp } from 'firebase/firestore'


function Deposit() {
  const params = useParams();
  const { currency } = params

  const navigate = useNavigate();

  const prompt = '今天发生了什么好事嘞🤔？'
  const placeholder = '我放了好臭好臭的臭臭屁😷'
  const numberPrompt1 = '我获得了'
  const numberPrompt2 = `个${currency}！！！`

  const heading = `记录好事存入${currency}`
  const gif = currency.startsWith('兔兔') ? bunnygif : piggygif;

  const goBack = () => {
    navigate(-1);
  }

  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')

  const [user, loading, error] = useAuthState(auth);
  const toast = useToast()
  

  const onSubmit = async() => {
    await addDoc(collection(db, 'deposits'), {
      userId: user.uid,
      description,
      amount,
      currency,
      createdAt: serverTimestamp()
    })
    toast({
      title: '提交成功',
      description: `今天的好事跟赚到的${currency}都被你记录下来啦！棒棒！`,
      status: 'success',
      duration: 9000,
      isClosable: true,
    })
    goBack()
  }

  const handleTextAreaInputChange = (e) => {
    const inputValue = e.target.value
    setDescription(inputValue)
  }
  const handleInputChange = (event) => {
    if (event.target.validity.valid) setAmount(event.target.value)
  }

  return (
    <>
      <Button onClick={goBack} leftIcon={<ArrowBackIcon />} colorScheme='teal' variant='solid'>
        返回
      </Button>
      <Container style={{ display: 'flex', flexDirection: 'column'}}>
        <Heading>{heading}</Heading>
        <AspectRatio maxW='200px' ratio={1}>
          <Image src={gif} alt='gif' objectFit='cover' />
        </AspectRatio>
        <Container style={{ marginTop: 40 }}>
          <Text fontSize='2xl'>{prompt}</Text>
          <Textarea 
            value={description}
            onChange={handleTextAreaInputChange}
            height="150" 
            placeholder={placeholder}/>
        </Container>
        <Container style={{ marginTop: 40, display: 'flex', alignItems:'center' }}>
          <Text fontSize='2xl'>{numberPrompt1}</Text>
          <Input 
            type="text" 
            pattern="[0-9]*"
            value={amount} 
            onChange={handleInputChange} 
            style={{ width: 150 }}
            size='lg'
            placeholder='1' />
          <Text fontSize='2xl'>{numberPrompt2}</Text>
        </Container>
        <Button onClick={onSubmit} style={{ marginTop: 50 }} colorScheme='teal' size='lg'>
          提交！
        </Button>

      </Container>
    </>
  );
}

export default Deposit;
