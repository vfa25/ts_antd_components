import React from 'react';
import { hot } from 'react-hot-loader';

export interface AppProps { compiler: string; framework: string; }

class App extends React.Component<AppProps, {}> {
  render() {
    return 2;
  }
}

export default hot(module)(App);
