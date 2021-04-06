import styled, { createGlobalStyle, ThemeProvider } from "styled-components";
import { ThemeProvider as NThemeProvider } from 'next-themes'
import Footer from '../components/Footer'

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
`;

const theme = {
  colors: {
    primary: "#0070f3",
  },
};

export default function App({ Component, pageProps }) {
  return (
    <Container>
      <GlobalStyle />
      <NThemeProvider defaultTheme={'dark'} enableSystem={false}>
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
      </ThemeProvider>
      </NThemeProvider>
      <Footer />
    </Container>
  );
}

const Container = styled.div`
  font-family: Inter;
  min-height: 50vh;
  margin: 20px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;