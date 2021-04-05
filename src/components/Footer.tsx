import styled from 'styled-components'
import Link from 'next/link'

export default function Footer() {
  return (
    <FootContainer>
      <Link href="https://github.com/atn"><a style={{textDecoration: 'none', color: '#0582ff'}}>GitHub </a></Link>
      -
      <Link href="mailto:austin@astn.me"><a style={{textDecoration: 'none', color: '#0582ff'}}> Contact</a></Link>
    </FootContainer>
  )
}

const FootContainer = styled.footer`
  position: fixed;
  padding: 10px;
  padding-bottom: 15px;
  left: 0;
  bottom: 0;
  width: 100%;
  color: rgb(0, 0, 0);
  text-align: center;
  font-weight: 550;
`