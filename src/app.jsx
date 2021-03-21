import React from 'react';
import "./app.scss";

import Home from './Pages/Home';
import { GlobalStorage } from './context/GlobalContext';

export class Application extends React.Component {
    render() {
        return (
            <GlobalStorage>
                <Home />
            </GlobalStorage>
        );
    }
}
