import * as React from 'react';

import { login, logout } from '../services/auth';

interface IAuth {
  username: string;
  role: string;
  formLoginError: boolean;
  login: Function;
  logout: Function;
}

const authDefault: IAuth = {
  username: '',
  role: '',
  formLoginError: false,
  login: () => ({}),
  logout: () => ({})
};

const authLocal: IAuth = JSON.parse(localStorage.getItem('auth'));

export const AuthContext = React.createContext(authLocal || authDefault);

export class AuthProvider extends React.Component {
  public state = authLocal || authDefault;

  constructor(props: any) {
    super(props);

    this.state.login = async (username: string, password: string) => {
      const data = await login(username, password);

      if (data) {
        this.setState(data);
        localStorage.setItem('auth', JSON.stringify(this.state));
      }
    };

    this.state.logout = () => {
      logout();
      this.setState({
        username: '',
        role: ''
      });
      localStorage.removeItem('auth');
    };
  }

  public render() {
    return (
      <AuthContext.Provider value={this.state}>
        {this.props.children}
      </AuthContext.Provider>
    );
  }
}
