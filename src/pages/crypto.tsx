import { useTheme } from 'next-themes'
import styled from 'styled-components'
import Link from 'next/link'

export default function Crypto() {
  const { theme } = useTheme()

  return (
    <>
    <Link href="/"><p style={{position: 'fixed', top: 0, left: 0, marginLeft: 20, padding: 7, fontFamily: 'Inter', cursor: 'pointer'}}>back</p></Link>
    <Box>
      <h1>Cryptocurrencies</h1>
      <Add>
        <strong>ETH: </strong>0x5517B0bf9617e73b44Fc2808636CAA262df0fCA1
      </Add>
      <Add>
        <strong>BTC: </strong>38aWjRfQ9MGRAa9ZWZwHpUqsmsMfudjZZP
      </Add>
      <Add>
        <strong>DOGE: </strong>DDWa9oPRE7xAm3KX5jD49up8kqS2HbwTMm
      </Add>
    </Box>
    </>
  )
}

export const Box = styled.div<{theme: string}>`
  background-color: ${p => p.theme === 'light' ? '#f4f4f4' : '#2e2e2e'};
  padding: 16px;
  font-size: 14px;
  font-weight: 300;
  margin-top: 11px;
  border-radius: 20px;
  text-align: center;
  display: flex;
  flex-direction: column;

  &:hover {
    opacity: 85%;
  }
`;

const Add = styled.div`
  margin: 7px
`