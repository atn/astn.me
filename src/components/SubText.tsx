import Typist from 'react-typist';
import styled from 'styled-components'

export default function SubText() {
  return (
    <TextContainer>
      <Typist startDelay={1200}>
        i make scalable, clean, and concise applications in typescript, react, and swift.
      </Typist>
    </TextContainer>
  )
}

const TextContainer = styled.div`
padding-top: 10px;
font-size: 20px;
font-family: Inter;
font-weight: 600;
`