import React from 'react';
import 'regenerator-runtime/runtime';
import cockpit from 'cockpit';
import './styles.scss';
import HostItem from '../HostItem';
import { GlobalContext } from '../../context/GlobalContext';

const HostList = ({ data }) => {
    const global = React.useContext(GlobalContext);
    const [objects, setObjects] = React.useState();

    const loadObjects = React.useCallback(() => {
        const objs = [];
        data.map((file, index) => {
            let serverName = '';
            let port = '';
            const dir = `/etc/httpd/conf.d/${file}`;

            cockpit.spawn(["grep", "ServerName", `${dir}`])
                    .then((date) => {
                        serverName = date.split(" ")[1].replaceAll("\n", "");

                        cockpit.spawn(["grep", "*:", `${dir}`])
                                .then((date) => {
                                    port = date.split(":")[1].replaceAll(">", "").replaceAll("\n", "");
                                    const obj = {
                                        file: data[index],
                                        serverName: serverName,
                                        port: port
                                    };
                                    objs.push(obj);
                                })
                                .then(() => {
                                    setObjects(objs);
                                });
                    });
        });
    }, []);

    React.useEffect(() => {
        loadObjects();
    }, []);

    return (
        <>
            {objects != null
                ? <div id='hostlist-container'>
                    {objects.map((e, index) => (
                        <HostItem vh={e.serverName} port={e.port} file={e.file} />
                    ))}
                  </div>
                : <div>Nenhum virtual host encontrado...</div>}
        </>
    );
};

export default HostList;
