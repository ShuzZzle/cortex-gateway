import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom';

import "@coreui/coreui/dist/css/coreui.min.css";

import App from './app/app';

ReactDOM.render(
  <StrictMode>
    <App />
  </StrictMode>,
  document.getElementById('root')
);
