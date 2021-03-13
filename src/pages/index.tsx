import styled from 'styled-components'
import { Head } from 'next/document'

import MainText from '../components/Text'
import SubText from '../components/SubText'

export default function Index() {
  return (
    <>
      <Container>
        <MainText />
        <SubText />
      </Container>
    </>
  )
}

const Container = styled.div`
  min-height: 50vh;
  margin-left: 25px;
  margin-right: 25px;
  display: flex;
  flex-direction: column;
  text-align: center;
  justify-content: center;
  align-items: center;
`;
