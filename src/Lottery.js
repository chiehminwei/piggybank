import { Text, Center, Button } from '@chakra-ui/react'
import { ArrowBackIcon } from '@chakra-ui/icons'
import { useNavigate } from "react-router-dom";

function Lottery() {
  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1);
  }
  
  const tbc = '敬请期待🤩🤩🤩'
  return (
    <div>
      <Button onClick={goBack} leftIcon={<ArrowBackIcon />} colorScheme='teal' variant='solid'>
        返回
      </Button>
      <Center>
        <Text fontSize='2xl'>
          {tbc}
        </Text>
      </Center>
    </div>
  );
}

export default Lottery;
