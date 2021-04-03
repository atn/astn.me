import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Activity } from '../types/lanyard'
import { useTheme } from 'next-themes'

export default function Doing() {
  const [doing, setDoing] = useState<Activity>();
  const { theme, } = useTheme()

  useEffect(() => {
    async function fetchState() {
      // github.com/phineas/lanyard
      const body = await fetch('https://api.lanyard.rest/v1/users/179742623601393664').then(res => res.json());

      if(body.success) setDoing(body.data.activities[body.data.activities.length - 1]);
    }
    
    fetchState();

    setInterval(() => fetchState(), 2500);
  }, []);


  if (!doing) return null;

  return (
    <Container theme={theme}>
      <ActivityRow>
          <ActivityImageContainer>
            <ActivityImage
              src={`https://cdn.discordapp.com/app-assets/${doing.application_id}/${doing.assets.large_image}.png`}
            />
            <ActivitySecondaryImage theme={theme}
              src={`https://cdn.discordapp.com/app-assets/${doing.application_id}/${doing.assets.small_image}.png`}
            />
          </ActivityImageContainer>
        <ActivityInfo>
          <h5>{doing.name}</h5>
            {doing.details &&
              <p>{doing.details}</p>
            }
          {doing.state && <p>{doing.state}</p>}
        </ActivityInfo>
    </ActivityRow>
  </Container>
  )
}

const Container = styled.div<{theme: string}>`
  background-color: ${p => p.theme === 'light' ? '#f4f4f4' : '#2e2e2e'};
  padding: 16px;
  cursor: pointer;
  margin-top: 20px;
  border-radius: 20px;
  &:hover {
    opacity: 90%;
  }
`;

const ActivityRow = styled.div`
  display: flex;
  flex-direction: row;
`;

const ActivityImageContainer = styled.div`
  position: relative;
  height: 50px;
`;

const ActivitySecondaryImage = styled.img<{theme: string}>`
  position: absolute;
  bottom: -5px;
  right: -5px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid ${p => p.theme === 'light' ? '#f4f4f4' : '#2e2e2e'};
`;

const ActivityImage = styled.img`
  height: 50px;
  width: 50px;
  border-radius: 10px;

  &:hover {
    opacity: 70%;
  }
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