import React from 'react';
import './styles.scss';
import { MdVisibility, MdEdit, MdDelete } from 'react-icons/md';
import { GlobalContext } from '../../context/GlobalContext';
import cockpit from 'cockpit';

import Swal from 'sweetalert2';
import { readFile } from '../../utils/file-functions';

function HostItem({ vh, port, file }) {
    const global = React.useContext(GlobalContext);
    const [portState, setPortState] = React.useState('');

    let view = "";

    const handleDelete = () => {
        Swal.fire({
            text: "Deseja realmente apagar o virtual host?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sim, quero apagar!'
        }).then((result) => {
            if (result.isConfirmed) {
                cockpit.spawn(["rm", `/etc/httpd/conf.d/${file}`]);
                Swal.fire(
                    'Removido!',
                    'Virtual Host removido com sucesso',
                    'success'
                );
                window.location.reload();
            }
        });
    };

    const handleView = () => {
        cockpit.file(`/etc/httpd/conf.d/${file}`).read()
                .done(function (content, tag) {
                    view = content;
                })
                .then(() => {
                    Swal.fire({
                        icon: 'info',
                        title: 'Virtual Host',
                        html: `<textarea rows="20" cols="60" disabled>${view}</textarea>`,
                        customClass: 'swal-wide'
                    });
                });
    };

    function readFile() {
        const dir = "/etc/httpd/conf.d/";
        let saida = '';
        let port = "";
        let serverAdmin = "";
        const serverName = "";
        const serverAlias = "";
        const documentRoot = "";
        const options = "";
        const allowOverride = "";
        const require = "";
        const errorLog = "";
        const customLog = "";
        const sslCert = "";
        const sslKeyRef = "";

        cockpit.spawn(["grep", `*:`, `${dir}${file}`])
                .then((data) => {
                    saida = data.split(":")[1].replaceAll(">", "").replaceAll("\n", "");
                    port = saida;

                    cockpit.spawn(["grep", `ServerAdmin`, `${dir}${file}`])
                            .then((data) => {
                                saida = data.split(" ")[1].replaceAll("\n", "");
                                serverAdmin = saida;
                                console.log(saida);
                            });
                });
    }

    const handleEdit = () => {
        readFile(file);
        global.setForm('edit');
    };

    return (
        <>
            <div id="host-item-container">
                <div id="vhost">
                    <h3>Virtual Host</h3>
                    <span>{vh}</span>
                </div>

                <div id="port">
                    <h3>Porta</h3>
                    <span>{port}</span>
                </div>

                <div id="actions">
                    <div id="icons">
                        <a href="#">
                            <div>
                                <MdVisibility size={30} onClick={handleView} />
                            </div>
                        </a>

                        {/* <a href="#">
                            <div>
                                <MdEdit size={30} onClick={handleEdit} />
                            </div>
                        </a> */}

                        <a href="#">
                            <div>
                                <MdDelete size={30} onClick={handleDelete} />
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
}

export default HostItem;
