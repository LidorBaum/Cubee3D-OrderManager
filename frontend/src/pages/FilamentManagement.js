import { Button } from '@mui/material';
import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { FilamentList } from '../cmps/FilamentList';
// import { useHistory } from 'react-router-dom';
// import { CompanyContext } from '../contexts/CompanyContext';
// import { BoardEmployeeList } from '../cmps/BoardEmployeeList';
// import employeeService from '../services/employeeService';
// import io from 'socket.io-client';
// import Spin from 'react-cssfx-loading/lib/Spin';
// import Select from 'react-select';
import { SnackbarHandlerContext } from '../contexts/SnackbarHandlerContext';
import filamentService from '../services/filamentService';
import { snackFilamentDeleted, snackNoFilaments } from '../snackMessages';
import Hypnosis from 'react-cssfx-loading/lib/Hypnosis';

export const FialmentMangement = () => {
    const notificationHandler = useContext(SnackbarHandlerContext);
    const [filaments, setFilaments] = useState(null);
    const [isRefresh, setDoRefresh] = useState(false);

    useEffect(() => {
        const getAllFilaments = async () => {
            const res = await filamentService.getAllFilaments();
            if (res.error) return notificationHandler.error(res.error.message);
            console.log(res);
            if (!res.length) {
                notificationHandler.error(snackNoFilaments);
            }
            setFilaments(res);
        };
        getAllFilaments();
    }, [isRefresh]);

    const deleteFilament = async filamentId => {
        console.log('deleteing filament');
        const res = await filamentService.removeFilament(filamentId);
        if (res.error) {
            return notificationHandler.error(res.error.message);
        }
        setDoRefresh(!isRefresh);
        notificationHandler.warning(snackFilamentDeleted);
    };

    if (!filaments)
        return (
            <div className="loader">
                <Hypnosis width="200px" height="200px" duration="3s" />
            </div>
        );
    if (filaments && filaments.length === 0) return <h1>No Filaments</h1>;
    return (
        <div>
            <div className="inventory-nav">
                <Button variant="contained" disabled>
                    Filaments
                </Button>
                <Link style={{ textDecoration: 'none' }} to="/inventory/vase">
                    <Button variant="contained">Vases</Button>{' '}
                </Link>
            </div>
            <div>
                <FilamentList
                    filaments={filaments}
                    deleteFilament={deleteFilament}
                />
            </div>
        </div>
    );
};
