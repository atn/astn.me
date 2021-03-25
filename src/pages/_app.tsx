import { createGlobalStyle, ThemeProvider } from "styled-components";
import { ThemeProvider as NThemeProvider } from 'next-themes'

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
    <>
      <GlobalStyle />
      <NThemeProvider defaultTheme={'dark'} enableSystem={false}>
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
      </ThemeProvider>
      </NThemeProvider>
    </>
  );
}