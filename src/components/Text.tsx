import Typist from 'react-typist';
import styled from 'styled-components'
import Link from 'next/link'

export default function SubText() {
  return (
    <TextContainer>
      <Typist>
        hi, i'm <Link href="https://github.com/atn"><a style={{textDecoration: 'none', color: '#0582ff'}}>austin</a></Link>
      </Typist>
    </TextContainer>
  )
}

const TextContainer = styled.div`
  font-size: 40px;
  text-align: center;
  font-weight: 550;
`