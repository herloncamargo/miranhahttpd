import React from 'react';
import cockpit from 'cockpit';

export const GlobalContext = React.createContext();

export const GlobalStorage = ({ children }) => {
    const [files, setFiles] = React.useState();
    const [form, setForm] = React.useState('list');
    const [add, setAdd] = React.useState(false);
    const [edit, setEdit] = React.useState({});
    const [ready, setReady] = React.useState(false);

    return (
        <GlobalContext.Provider value={{ files, setFiles, form, setForm, edit, setEdit, ready, setReady, add, setAdd }}>
            {children}
        </GlobalContext.Provider>
    );
};
