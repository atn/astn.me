import { useEffect, useState } from 'react';
import styled from 'styled-components'

interface HashRes {
  hashrate: number,
  online: number,
  updatedUnix: number
}

export default function Hashrate() {
  const [hashState, setHash] = useState<HashRes>()
  
  useEffect(() => {
    async function fetchHash() {
      const hash = await fetch('https://eth.2miners.com/api/accounts/0x5517b0bf9617e73b44fc2808636caa262df0fca1').then(res => res.json()) 
      setHash({hashrate: hash.currentHashrate, online: hash.workersOnline, updatedUnix: hash.updatedAt})
    }

    fetchHash()

    setTimeout(() => fetchHash(), 5000);
  }, [])

  if (!hashState || hashState.online < 1) return null;

  return (
    <Container>
        current <strong>ETH</strong> hashrate: {(hashState.hashrate / 1000000).toFixed(3)}MH/s
    </Container>
  )
}


export const Container = styled.div<{theme: string}>`
  background-color: ${p => p.theme === 'light' ? '#f4f4f4' : '#2e2e2e'};
  padding: 16px;
  font-size: 14px;
  font-weight: 300;
  margin-top: 11px;
  border-radius: 20px;
  text-align: center;

  &:hover {
    opacity: 85%;
  }
`;