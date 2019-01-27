import * as React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import { Menu } from './components/Menu';
import { Content } from './components/Content';

import { AuthProvider } from './context/auth';

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Menu />
        <Content />
      </AuthProvider>
    </BrowserRouter>
  );
}

render(<App />, document.getElementById('app'));
