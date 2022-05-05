import { Box, Container, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import Login from '../components/Authentication/Login'
import SignUp from '../components/Authentication/SignUp'

const Homepage = () => {

	const history = useHistory();

	useEffect(() => {
	const userInfo = JSON.parse(	localStorage.getItem('userInfo'));

	if (userInfo) {
		history.push("/chats")
	}
	}, [history]);

	return (
		<Container>
			<Box
			d='flex'
			justifyContent='center'
			p={3}
			bg='white'
			w='100%'
			m='40px 0 15px 0'
			borderRadius={'lg'}
			borderWidth='1px'
			>
				<Text fontSize={'4xl'} fontFamily={'Work sans'} fontWeight={'bold'}>Scribbler</Text>
			</Box>
			<Box
			bg={'white'}
			w={'100%'}
			p={4}
			borderRadius='lg'
			borderWidth={'1px'}
			>
	<Tabs variant='soft-rounded'>
  <TabList mb={'1em'}>
    <Tab width={"50%"}>Login</Tab>
    <Tab width={"50%"}>Sign up</Tab>
  </TabList>
  <TabPanels>
    <TabPanel>
      <Login/>
    </TabPanel>
    <TabPanel>
      <SignUp/>
    </TabPanel>
  </TabPanels>
</Tabs>
			</Box>
		</Container>
	)
}

export default Homepage