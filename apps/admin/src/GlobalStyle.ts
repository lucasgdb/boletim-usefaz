import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  input:-webkit-autofill,
  input:-webkit-autofill:hover, 
  input:-webkit-autofill:focus, 
  input:-webkit-autofill:active {
    box-shadow: 0 0 0 30px #F7F5FA inset !important;
  }

  body {
    padding-right: 0 !important;
  }
`;

export default GlobalStyle;
