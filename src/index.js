import "./lib/patternfly/patternfly-4-cockpit.scss";

import "core-js/stable";

import React from 'react';
import ReactDOM from 'react-dom';
import { Application } from './app.jsx';
/*
 * PF4 overrides need to come after the JSX components imports because
 * these are importing CSS stylesheets that we are overriding
 * Having the overrides here will ensure that when mini-css-extract-plugin will extract the CSS
 * out of the dist/index.js and since it will maintain the order of the imported CSS,
 * the overrides will be correctly in the end of our stylesheet.
 */
import "./lib/patternfly/patternfly-4-overrides.scss";
import './app.scss';
import 'sweetalert2/src/sweetalert2.scss';

document.addEventListener("DOMContentLoaded", function () {
    ReactDOM.render(React.createElement(Application, {}), document.getElementById('app'));
});
