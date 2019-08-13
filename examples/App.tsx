import React from 'react'
import { hot } from 'react-hot-loader/root'
import Components from './demoComponents'
require('../index')

const e = React.createElement

export interface AppProps {
    compiler: string
    framework: string
}

class App extends React.Component<AppProps, {}> {
    render() {
        return Object.keys(Components).map(name => e(Components[name], { key: name }, null))
    }
}

export default hot(App)
