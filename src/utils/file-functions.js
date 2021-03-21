
export function saveFile(object) {
    let saida = "";

    saida += `<VirtualHost *:80>\n`;
    saida += `\tServerAdmin ${object.serverAdmin}\n`;
    saida += `\tServerName ${object.serverName}\n`;

    if (object.serverAlias)
        saida += `\tServerAlias ${object.serverAlias}\n`;

    saida += `\tDocumentRoot "${object.documentRoot}"\n`;

    if (object.options || object.allowOverride || object.require || object.port == '443')
        saida += `\t<Directory "${object.documentRoot}/">\n`;

    if (object.options)
        saida += `\t\tOptions ${object.options}\n`;

    if (object.allowOverride)
        saida += `\t\tAllowOverride ${object.allowOverride}\n`;

    if (object.require)
        saida += `\t\t${object.require}\n`;

    if (object.port == '443')
        saida += `\t\tSSLRequireSSL\n`;
    if (object.options || object.allowOverride || object.require || object.port == '443')
        saida += `\t</Directory>\n`;

    if (object.errorLog)
        saida += `\tErrorLog "${object.errorLog}"\n`;
    if (object.customLog)
        saida += `\tCustomLog "${object.customLog}" combined\n`;

    if (object.port == '443')
        saida += `\tRedirect / https://${object.serverName}/\n`;

    saida += `</VirtualHost>\n`;

    cockpit.spawn(["touch", `/etc/httpd/conf.d/${object.serverName}.conf`])
            .then(() => {
                cockpit.file(`/etc/httpd/conf.d/${object.serverName}.conf`).replace(saida)
                        .done(function (tag) {
                            if (object.port == '80')
                                window.location.reload();
                        })
                        .fail(function (error) {
                            console.log(error);
                        });
            });

    if (object.port == '443') {
        let saidaHttps = "";
        saidaHttps += `<VirtualHost *:443>\n`;
        saidaHttps += `\tServerName ${object.serverName}\n`;
        saidaHttps += `\tDocumentRoot "${object.documentRoot}"\n\n`;

        saidaHttps += `\tSSLEngine on\n`;
        if (object.sslCert)
            saidaHttps += `\tSSLCertificateFile "${object.sslCert}"\n`;
        if (object.sslKeyRef)
            saidaHttps += `\tSSLCertificateKeyFile "${object.sslKeyRef}"\n`;
        saidaHttps += `</VirtualHost>\n`;

        cockpit.spawn(["touch", `/etc/httpd/conf.d/ssl-${object.serverName}.conf`])
                .then(() => {
                    cockpit.file(`/etc/httpd/conf.d/ssl-${object.serverName}.conf`).replace(saidaHttps)
                            .done(function (tag) {
                                window.location.reload();
                            })
                            .fail(function (error) {
                                console.log(error);
                            });
                });
    }
}

export function readType1(file, string) {
    const dir = "/etc/httpd/conf.d/";
    const saida = "";
    cockpit.spawn(["grep", `${string}`, `${dir}${file}`])
            .then((data) => {
                const saida = data.split(" ")[1].replaceAll("\n", "");
                console.log(saida);
            });
    return saida;
}

export function readType2(file, string) {
    const dir = "/etc/httpd/conf.d/";
    const saida = "";
    cockpit.spawn(["grep", `${string}`, `${dir}${file}`])
            .then((data) => {
                const saida = data.replaceAll("\n", "").replaceAll("\t", "");
                console.log(saida);
            });
    return saida;
}

export function readType3(file, string) {
    const dir = "/etc/httpd/conf.d/";
    const saida = "";
    cockpit.spawn(["grep", `${string}`, `${dir}${file}`])
            .then((data) => {
                const saida = data.split(" ")[1].replaceAll("\n", "").replaceAll("\"", "");
                console.log(saida);
            });
    return saida;
}

export function readType4(file, string) {
    const dir = "/etc/httpd/conf.d/";
    var saida = "";
    cockpit.spawn(["grep", `${string}`, `${dir}${file}`])
            .then((data) => {
                saida = data.split(":")[1].replaceAll(">", "").replaceAll("\n", "");
                console.log(saida);
            });
    return saida;
}

export function readType5(file, string) {
    const dir = "/etc/httpd/conf.d/";
    const saida = "";
    cockpit.spawn(["grep", `${string}`, `${dir}${file}`])
            .then((data) => {
                let saida = data.split(" ")[1];
                saida += " " + data.split(" ")[2].replaceAll("\n", "");
                console.log(saida);
            });
    return saida;
}

export function readFile(file) {
    const obj = {};

    obj.port = readType4(file, '*:');
    obj.serverAdmin = readType1(file, 'ServerAdmin');
    obj.serverName = readType1(file, 'ServerName');
    obj.serverAlias = readType1(file, 'ServerAlias');
    obj.documentRoot = readType3(file, "DocumentRoot");
    obj.options = readType5(file, 'Options');
    obj.allowOverride = readType1(file, "AllowOverride");
    obj.require = readType2(file, "granted");
    obj.errorLog = readType3(file, "ErrorLog");
    obj.customLog = readType3(file, "CustomLog");
    obj.sslCert = readType3(file, "SSLCertificateFile");
    obj.sslKeyRef = readType3(file, "SSLCertificateKeyFile");
    console.log(readType4(file, '*:'));

    return obj;
}
