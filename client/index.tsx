import * as React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import { Menu } from './components/Menu';
import { Content } from './components/Content';

import { AuthProvider } from './context/auth';

render(
  <BrowserRouter>
    <AuthProvider>
      <Menu />
      <Content />
    </AuthProvider>
  </BrowserRouter>,
  document.getElementById('root')
);
