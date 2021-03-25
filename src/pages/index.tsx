import styled from 'styled-components'
import { useTheme } from 'next-themes'

import MainText from '../components/Text'
import Doing from '../components/Doing'

export default function Index() {
  const { theme, setTheme } = useTheme()
  return (
    <>
      <Container>
        <MainText />
        <Doing />
        <p onClick={() => theme === 'light' ? setTheme('dark') : setTheme('light')} style={{position: 'fixed', bottom: 0, left: 0, paddingLeft: 20, fontFamily: 'Inter', cursor: 'pointer'}}>toggle theme</p>
      </Container>
    </>
  )
}

const Container = styled.div`
  min-height: 50vh;
  margin: 20px;
  padding: 10px;
  display: flex;
  border-radius: 40px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;