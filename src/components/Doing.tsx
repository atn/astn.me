import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Presence } from '../types/lanyard'
import { useTheme } from 'next-themes'

export default function Doing() {
  const [doing, setDoing] = useState<Presence>();
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    async function fetchState() {
      const body = await fetch('https://api.lanyard.rest/v1/users/179742623601393664').then(res => res.json());

      if(body.success) {
        setDoing(body.data);
      }
    }
    
    fetchState();

    setInterval(() => {
      console.log(theme)
      fetchState();
    }, 2500);
  }, []);


  if(!doing) return null;

  return (
    <>
    {doing.activities[0] &&
    <Container theme={theme}>
      <ActivityRow>
          <ActivityImageContainer>
            <ActivityImage
              src={`https://cdn.discordapp.com/app-assets/${doing.activities[doing.activities.length - 1].application_id}/${doing.activities[doing.activities.length - 1].assets.large_image}.png`}
            />
            <ActivitySecondaryImage theme={theme}
              src={`https://cdn.discordapp.com/app-assets/${doing.activities[doing.activities.length - 1].application_id}/${doing.activities[doing.activities.length - 1].assets.small_image}.png`}
            />
          </ActivityImageContainer>
        <ActivityInfo>
          <h5>{doing.activities[doing.activities.length - 1].name}</h5>
            {doing.activities[doing.activities.length - 1].details &&
              <p>{doing.activities[doing.activities.length - 1].details}</p>
            }
          {doing.activities[doing.activities.length - 1].state && <p>{doing.activities[doing.activities.length - 1].state}</p>}
        </ActivityInfo>
    </ActivityRow>
  </Container>
  }
</>
  )
}

const Container = styled.div<{theme: string}>`
  font-family: Inter;
  background-color: ${p => p.theme === 'light' ? '#f4f4f4' : '#2e2e2e'};
  padding: 16px;
  cursor: pointer;
  margin-top: 20px;
  border-radius: 20px;
`;

const ActivityRow = styled.div`
  -webkit-user-select: none;  
  -moz-user-select: none;    
  -ms-user-select: none;      
  user-select: none;
  display: flex;
  flex-direction: row;
`;

const ActivityImageContainer = styled.div`
  position: relative;
  height: 50px;
`;

const ActivityImage = styled.img`
  height: 50px;
  width: 50px;
  border-radius: 10px;
`;

const ActivitySecondaryImage = styled.img<{theme: string}>`
  position: absolute;
  bottom: -5px;
  right: -5px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid ${p => p.theme === 'light' ? '#fff' : '#2e2e2e'};
`;

const ActivityInfo = styled.div`
  margin-left: 1rem;
  h5 {
    margin: 0;
    font-size: 13px;
  }
  p {
    margin: 0;
    padding-top: 3px;
    font-size: 10px;
  }
`;