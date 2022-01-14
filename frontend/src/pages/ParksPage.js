import React, { useEffect, useState, useContext } from 'react';
// import { useHistory } from 'react-router-dom';
// import { CompanyContext } from '../contexts/CompanyContext';
// import { BoardEmployeeList } from '../cmps/BoardEmployeeList';
// import employeeService from '../services/employeeService';
// import io from 'socket.io-client';
// import Spin from 'react-cssfx-loading/lib/Spin';
// import Select from 'react-select';
// import { SnackbarHandlerContext } from '../contexts/SnackbarHandlerContext';
// import { snackNoEmployees } from '../snackMessages';
import GoogleMap from '../cmps/GoogleMap'




export const ParksPage = () => {




    return (
        <div className='mapcon'>
        <GoogleMap />
        </div>
        
    )

};
