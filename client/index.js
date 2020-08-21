import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'mobx-react';

import {App} from './components';
import {AuthStore, LoginStore, RegisterStore} from './stores';

import './common/styles/Main.scss';

const Application = () => 
    <Provider
        AuthStore={AuthStore}
        LoginStore={LoginStore}
        RegisterStore={RegisterStore}
    >
        <App />
    </Provider>;

ReactDOM.render(<Application />, document.getElementById('app'));