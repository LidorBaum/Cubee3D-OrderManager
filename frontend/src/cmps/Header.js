import React, { useContext, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import { useHistory } from 'react-router-dom';
import { SnackbarHandlerContext } from '../contexts/SnackbarHandlerContext';
import userService from '../services/userService';

export const Header = props => {

    let history = useHistory();
    const notificationHandler = useContext(SnackbarHandlerContext);
    
    return (
        // <div className='header'>
            <div className="links">
                <NavLink
                    activeClassName="active"
                    to={'/inventory/vase'}
                    exact={true}
                >
                    Vases
                </NavLink>
                <NavLink
                    activeClassName="active"
                    to={'/inventory/filament'}
                    exact={true}
                >
                    Filaments
                </NavLink>
                <NavLink
                    activeClassName="active"
                    to={'/inventory/order'}
                    exact={true}
                >
                    Orders
                </NavLink>
                <NavLink activeClassName="active" to={'/order'} exact={true}>
                    Place An Order
                </NavLink>
            </div>
        //    {/* {store && <img src='https://res.cloudinary.com/echoshare/image/upload/v1642465658/Cubee3D/61995740_2245317985550489_7473695634269143040_n_pr2m2w.jpg' />} */}
        //{/* </div> */}
    );
}
