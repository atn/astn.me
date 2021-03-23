import { useEffect, useState } from "react";
import styled from 'styled-components'
import { Presence } from '../types/lanyard'

const discord_id = '179742623601393664'

export default function Doing() {
  const [state, setState] = useState<Presence>()

  useEffect(() => {
    setInterval(async () => {
      const res = await fetch(`https://api.lanyard.rest/v1/users/${discord_id}`)
      const json = await res.json()
      setState(json.data)
      console.log(json.data)
    }, 5000)
  }, [])

  return (
    <>
    {state && state.activities[0] ? (
    <Container>
      <p>currently {state.activities[0].details} in {state.activities[0].name}</p>
    </Container>
    ) : null}
   </>
  ) 
}

const Container = styled.div`
font-size: 12px;
font-family: Inter;
font-weight: 400;
margin-top: 10px;
padding-top: 5px;
padding-bottom: 5px;
padding-left: 20px;
padding-right: 20px;
display: flex;
border-radius: 20px;
background: #f4f4f4;
`