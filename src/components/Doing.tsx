import { useEffect, useState } from "react";
import styled from 'styled-components'
import { Presence } from '../types/lanyard'

const discord_id = '179742623601393664'

export default function Doing() {
  const [state, setState] = useState<Presence>()
  const [loadingState, setLoading] = useState(false)

  async function fetchInitialState() {
    setLoading(true)
    const res = await fetch(`https://api.lanyard.rest/v1/users/${discord_id}`)
    const json = await res.json()
    setState(json.data)
    setLoading(false)
  }

  useEffect(() => {
    fetchInitialState()
    setInterval(async () => {
      const res = await fetch(`https://api.lanyard.rest/v1/users/${discord_id}`)
      const json = await res.json()
      setState(json.data)
    }, 5000)
  }, [])

  return (
    <>
      <Container>
        {state && state.activities[0] ? (
          <p>currently {state.activities[0].details} in {state.activities[0].name}</p>
        ) : null}
        {loadingState && <p>Loading State...</p>}
      </Container>
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
background-color: #f4f4f4;
`