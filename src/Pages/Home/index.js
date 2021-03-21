/* eslint-disable no-unused-vars */
import React from 'react';
import cockpit from 'cockpit';
import './styles.scss';
import HostForm from '../HostForm';
import { GlobalContext } from '../../context/GlobalContext';

import { Switch, Button } from '@patternfly/react-core';

import HostList from '../../components/HostList';
import { readFile } from '../../utils/file-functions';

const Home = () => {
    const global = React.useContext(GlobalContext);
    const [enable, setEnable] = React.useState();
    const [start, setStart] = React.useState();
    const [files, setFiles] = React.useState();
    const [loading, setLoading] = React.useState(true);

    const enableRef = React.useRef();
    const startRef = React.useRef();

    const initialState = {
        port: "",
        serverAdmin: "",
        serverName: "",
        serverAlias:"",
        documentRoot:"",
        options:"",
        allowOverride:"",
        require:"",
        errorLog:"",
        customLog:"",
        sslCert:"",
        sslKeyRef:""
    };

    function handleAdd() {
        global.setForm('form');
        global.setAdd(true);
    }

    const checkStatus = React.useCallback(() => {
        cockpit.spawn(["systemctl", "status", "httpd"])
                .stream((data) => {
                    (data.split(" ")[12] === "enabled;") ? setEnable(true) : setEnable(false);
                    (data.split(" ")[19] === "active") ? setStart(true) : setStart(false);
                    (data.split(" ")[12] === "disabled;" || data.split(" ")[12] === "failed") ? setEnable(false) : setEnable(true);
                    (data.split(" ")[19] === "inactive") ? setStart(false) : setStart(true);
                })
                .then(() => console.log('Ready status ok'))
                .catch(() => console.log('Status read fail'));
    });

    const getFiles = React.useCallback(() => {
        const list = [];
        cockpit.spawn(["ls", "/etc/httpd/conf.d/"])
                .stream((data) => {
                    const regex = /[a-z0-9.-]*\.conf?$/;
                    data.split('\n').map((f) => {
                        if (f.match(regex)) list.push(f);
                    });
                })
                .then(() => {
                    setLoading(false);
                    setFiles(list);
                });
    });

    const toggleEnable = React.useCallback(() => {
        if (!enable)
            cockpit.spawn(["systemctl", "enable", "httpd"]);
        if (enable)
            cockpit.spawn(["systemctl", "disable", "httpd"]);
        setEnable(!enable);
    }, [enable]);

    const toggleStart = React.useCallback(() => {
        if (start)
            cockpit.spawn(["systemctl", "stop", "httpd"]);
        if (!start)
            cockpit.spawn(["systemctl", "start", "httpd"]);
        setStart(!start);
    }, [start]);

    React.useEffect(() => {
        checkStatus();
        getFiles();
        global.setEdit(initialState);
    }, []);

    return (
        <>
            {!loading
                ? <div id="container">
                    <div id="header">
                        <div id="logotipo">
                            <h1 onClick={() => readFile('www.animais.com.br.conf')}>MiranhaHTTP</h1>
                        </div>
                        <div id="status">
                            <h3>STATUS HTTPD SERVICE</h3>
                            <div>
                                <div id="disabled">
                                    {enable
                                        ? <Switch id="switch-disabled-on" aria-label="Enabled" label="Enabled" labelOff="Enabled" isChecked onClick={toggleEnable} ref={enableRef} />
                                        : <Switch id="switch-disabled-on" aria-label="Disabled" label="Disabled" labelOff="Disabled" isChecked={false} onClick={toggleEnable} ref={enableRef} />}
                                </div>
                                <div id="start">
                                    {start
                                        ? <Switch id="switch-start-on" aria-label="Start" label="Start" labelOff="Start" isChecked onClick={toggleStart} ref={startRef} />
                                        : <Switch id="switch-start-off" aria-label="Stop" label="Stop" labelOff="Stop" isChecked={false} onClick={toggleStart} ref={startRef} />}
                                </div>
                            </div>
                        </div>
                    </div>

                    {global.form == 'list'
                        ? <div id="lista">
                            <div id="button-add">
                                <Button variant="primary" onClick={handleAdd}>+ ADICIONAR VIRTUAL HOST</Button>
                            </div>
                            {files != null
                                ? <div id="list-container">
                                    <HostList data={files} />
                                </div>
                                : <div>Vazio</div>}
                        </div>
                        : <div />}

                    {global.form == 'form'
                        ? <div id="host-form">
                            <HostForm />
                          </div>
                        : <div />}

                    {global.form == 'edit'
                        ? <div id="host-form">
                            <HostForm />
                          </div>
                        : <div />}

                  </div>
                : <div>Carregando...</div>}
        </>
    );
};

export default Home;
