import styled from 'styled-components'
import { useTheme } from 'next-themes'

import MainText from '../components/Text'
import Doing from '../components/Doing'
import Hashrate from '../components/Hashrate'
import Footer from '../components/Footer'

export default function Index() {
  const { theme, setTheme } = useTheme()

  function toggleTheme() {
    theme === 'light' ? setTheme('dark') : setTheme('light')
  }

  return (
    <Container>
      <MainText />
      <Doing />
      <Hashrate />
      <Footer />
      <p onClick={() => toggleTheme()} style={{position: 'fixed', top: 0, left: 0, marginLeft: 20, padding: 7, fontFamily: 'Inter', cursor: 'pointer'}}>toggle theme</p>
    </Container>
  )
}

const Container = styled.div`
  -webkit-user-select: none;  
  -moz-user-select: none;    
  -ms-user-select: none;      
  user-select: none;
  font-family: Inter;
  min-height: 50vh;
  margin: 20px;
  padding: 10px;
  display: flex;
  border-radius: 40px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;