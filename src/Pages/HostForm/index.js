import React from 'react';
import './styles.scss';
import { GlobalContext } from '../../context/GlobalContext';
import { Button, Radio } from '@patternfly/react-core';
import cockpit from 'cockpit';
import { saveFile } from '../../utils/file-functions';

function HostForm(host) {
    const global = React.useContext(GlobalContext);
    const [https, setHttps] = React.useState(false);
    const [validate, setValidate] = React.useState(false);
    const [pronto, setPronto] = React.useState(false);

    const tipoRef = React.useRef();
    const serverAdminRef = React.useRef();
    const serverNameRef = React.useRef();
    const serverAliasRef = React.useRef();
    const documentRootRef = React.useRef();
    const errorLogRef = React.useRef();
    const customLogRef = React.useRef();
    const indexesRef = React.useRef();
    const overrideRef = React.useRef();
    const accessRef = React.useRef();
    const sslCertRef = React.useRef();
    const sslKeyRef = React.useRef();

    const handleSubmit = (e) => {
        e.preventDefault();
        const vhost = {
            port: tipoRef.current.value,
            serverAdmin: serverAdminRef.current.value,
            serverName: serverNameRef.current.value,
            serverAlias: serverAliasRef.current.value,
            documentRoot: documentRootRef.current.value,
            options: indexesRef.current.value,
            allowOverride: overrideRef.current.value,
            require: accessRef.current.value,
            errorLog: errorLogRef.current.value,
            customLog: customLogRef.current.value,
        };

        if (https) {
            vhost.sslCert = sslCertRef.current.value;
            vhost.sslKeyRef = sslKeyRef.current.value;
        }

        saveFile(vhost);
    };

    const handleTipo = () => {
        if (tipoRef.current.value == '80')
            setHttps(false);
        if (tipoRef.current.value == '443')
            setHttps(true);
    };

    const handleValidate = () => {
        if (serverNameRef.current.value && documentRootRef.current.value)
            setValidate(true);
        else
            setValidate(false);
    };

    React.useEffect(() => {
        if (global.add)
            global.setReady(true);
    }, []);

    return (
        <>
            {global.ready
                ? <div id="form" onSubmit={handleSubmit}>
                    <div id="form-container">
                        <form onSubmit={handleSubmit}>
                            <div className="form-field" id="radio">
                                <label htmlFor="indexes-select">Tipo</label>
                                <select name="indexesselect" ref={tipoRef} onChange={handleTipo}>
                                    <option value="80">HTTP</option>
                                    <option value="443">HTTPS</option>
                                </select>
                                <span className="legenda">Nível de segurança do Virtual Host</span>
                            </div>
                            <div className="form-field">
                                <label htmlFor="server-admin">Server Admin</label>
                                <input type="text" name="serveradmin" id="server-admin" ref={serverAdminRef} />
                                <span className="legenda">Email do administrador. Ex.: admin@example.com.br </span>
                            </div>
                            <div className="form-field">
                                <label htmlFor="server-name">Server Name *</label>
                                <input type="text" name="servername" id="server-name" ref={serverNameRef} onBlur={handleValidate} />
                                <span className="legenda">Nome do VirtualHost. Ex.: www.example.com.br </span>
                            </div>
                            <div className="form-field">
                                <label htmlFor="server-alias">Server Alias</label>
                                <input type="text" name="serveralias" id="server-alias" ref={serverAliasRef} />
                                <span className="legenda">Apelido do VirtualHost. Ex.: example.com.br (url sem o www) </span>
                            </div>
                            <div className="form-field">
                                <label htmlFor="document-root">Document Root *</label>
                                <input type="text" name="documentroot" id="document-root" ref={documentRootRef} onBlur={handleValidate} />
                                <span className="legenda">Diretório dos arquivos do Virtual Host. Ex.: /var/www/html/example (sem barra no final).</span>
                            </div>
                            <div className="form-field">
                                <label htmlFor="error-log">Error Log</label>
                                <input type="text" name="errorlog" id="error-log" ref={errorLogRef} />
                                <span className="legenda">Arquivo com logs de erros. Ex.:/var/www/html/example/error.log  </span>
                            </div>
                            <div className="form-field">
                                <label htmlFor="custom-log">Custom Log</label>
                                <input type="text" name="customlog" id="custom-log" ref={customLogRef} />
                                <span className="legenda">Arquivo com logs de erros. Ex.:/var/www/html/example/custom.log  </span>
                            </div>
                            {https
                                ? <div>
                                    <div className="form-field">
                                        <label htmlFor="ssl-cert">SSL Certificate File</label>
                                        <input type="text" name="ssl-cert" id="ssl-cert" ref={sslCertRef} />
                                        <span className="legenda">Certificado do Virtual Host. Ex.: /etc/ssl/mycerts/cert-www.example.com.br.pem  </span>
                                    </div>
                                    <div className="form-field">
                                        <label htmlFor="ssl-key">SSL Certificate Key File</label>
                                        <input type="text" name="ssl-key" id="ssl-key" ref={sslKeyRef} />
                                        <span className="legenda">Chave privada do Virtual Host. Ex.: /etc/ssl/mycerts/priv-www.example.com.br.pem  </span>
                                    </div>
                                  </div>
                                : <div />}

                            <h3 style={{ margin: '20px 0' }}>Opções do diretório raiz</h3>

                            <div id="list-options">
                                <div>
                                    <label htmlFor="indexes-select">Listagem de Arquivos</label>
                                    <select name="indexesselect" ref={indexesRef}>
                                        <option value="" />
                                        <option value="Indexes FollowSymLinks">+Indexes</option>
                                        <option value="-Indexes">-Indexes</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="override-select">Allow Override</label>
                                    <select name="overrideselect" ref={overrideRef}>
                                        <option value="" />
                                        <option value="all">All</option>
                                        <option value="none">None</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="access-select">Permissão de acesso</label>
                                    <select name="accessselect" ref={accessRef}>
                                        <option value="" />
                                        <option value="Require all granted">Require all granted</option>
                                        <option value="Require all denied">Require all denied</option>
                                    </select>
                                </div>
                            </div>

                            <div id="button-container">
                                { validate ? <Button variant="primary" type="submit">SALVAR VIRTUAL HOST</Button>
                                    : <Button variant="primary" isDisabled>SALVAR VIRTUAL HOST</Button>}

                                <Button variant="primary" onClick={ () => window.location.reload() }>VOLTAR</Button>
                            </div>

                        </form>
                    </div>
                  </div>
                : <div>Carregando</div>}
        </>
    );
}

export default HostForm;
