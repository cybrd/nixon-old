import * as React from 'react';

import { authLogin, authLogout } from '../services/Auth';

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
  login: () => {},
  logout: () => {}
};

let authLocal: IAuth = JSON.parse(localStorage.getItem('auth'));

export const AuthContext = React.createContext(authLocal || authDefault);

export class AuthProvider extends React.Component {
  state = authLocal || authDefault;

  constructor(props: any) {
    super(props);

    this.state.login = async (username: string, password: string) => {
      const data = await authLogin(username, password);

      if (data) {
        this.setState(data);
        localStorage.setItem('auth', JSON.stringify(this.state));
      }
    };

    this.state.logout = () => {
      authLogout();
      this.setState({
        username: '',
        role: ''
      });
      localStorage.removeItem('auth');
    };
  }

  render() {
    return (
      <AuthContext.Provider value={this.state}>
        {this.props.children}
      </AuthContext.Provider>
    );
  }
}
