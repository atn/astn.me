import styled from 'styled-components'

import MainText from '../components/Text'
import SubText from '../components/SubText'
import Doing from '../components/Doing'

export default function Index() {
  return (
    <>
      <Container>
        <MainText />
        <Doing />
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
  text-align: center;
  justify-content: center;
  align-items: center;
`;