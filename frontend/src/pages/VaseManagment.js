import React, { useEffect, useState, useContext } from 'react';
import { VaseList } from '../cmps/VaseList';
// import { useHistory } from 'react-router-dom';
// import { CompanyContext } from '../contexts/CompanyContext';
// import { BoardEmployeeList } from '../cmps/BoardEmployeeList';
// import employeeService from '../services/employeeService';
// import io from 'socket.io-client';
// import Spin from 'react-cssfx-loading/lib/Spin';
// import Select from 'react-select';
import { SnackbarHandlerContext } from '../contexts/SnackbarHandlerContext';
import vaseService from '../services/vaseService';
import { snackNoVases, snackVaseDeleted } from '../snackMessages';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import Hypnosis from 'react-cssfx-loading/lib/Hypnosis';

export const VaseManagment = () => {
    const notificationHandler = useContext(SnackbarHandlerContext);
    const [vases, setVases] = useState(null);
    const [isRefresh, setDoRefresh] = useState(false);

    useEffect(() => {
        const getAllVases = async () => {
            const res = await vaseService.getAllVases();
            if (res.error) return notificationHandler.error(res.error.message);
            console.log(res);
            if (!res.length) {
                notificationHandler.error(snackNoVases);
            }
            setVases(res);
        };
        getAllVases();
    }, []);

    const deleteVase = async vaseId => {
        console.log('deleteing vase');
        const res = await vaseService.removeVase(vaseId);
        if (res.error) {
            return notificationHandler.error(res.error.message);
        }
        setDoRefresh(!isRefresh);
        notificationHandler.warning(snackVaseDeleted);
    };

    if (!vases)
        return (
            <div className="loader">
                <Hypnosis width="200px" height="200px" duration="3s" />
            </div>
        );
    if (vases && vases.length === 0) return <h1>No Vases</h1>;
    return (
        <div>
            <div className="inventory-nav">
                <Link
                    style={{ textDecoration: 'none' }}
                    to="/inventory/filament"
                >
                    {' '}
                    <Button variant="contained">Filaments</Button>
                </Link>
                <Button disabled variant="contained">
                    Vases
                </Button>
            </div>{' '}
            <div>
                <VaseList vases={vases} deleteVase={deleteVase} />
            </div>
        </div>
    );
};
