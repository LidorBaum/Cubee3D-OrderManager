import React, { useContext, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import { useHistory } from 'react-router-dom';
import { SnackbarHandlerContext } from '../contexts/SnackbarHandlerContext';
import { Button } from '@mui/material';
import userService from '../services/userService';

export const Header = props => {
    const { loggedUser, setLoggedUser } = useContext(UserContext);
    let history = useHistory();
    const notificationHandler = useContext(SnackbarHandlerContext);
    useEffect(() => {
    }, [loggedUser]);

    const onLogout = async () => {
        const res = await userService.logout();
        if (res?.error) return notificationHandler.error(res.error.message);
        setLoggedUser(null);
        history.push('/');
    };
    // const onLogout = async () => {
    //   const res = await companyService.logoutCompany();
    //   if (res?.error) return notificationHandler.error(res.error.message);
    //   setLoggedCompany(null);
    //   history.push("/");
    // };
    if (false) return <div>Header</div>;
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
    // return (
    //   <div className="header">
    //     <NavLink to={"/"}>
    //       <img
    //         alt="logo"
    //         src={
    //           loggedCompany
    //             ? loggedCompany.logo
    //             : "https://res.cloudinary.com/echoshare/image/upload/v1636287815/echo_icon_q1hjeb.png"
    //         }
    //       />
    //     </NavLink>
    //     {loggedCompany && (
    //       <div className="company-name">{loggedCompany.name}</div>
    //     )}
    //     <div className="links">
    //       {loggedCompany && (
    //         <NavLink activeClassName="active" to={"/company"} exact={true}>
    //           Company Profile
    //         </NavLink>
    //       )}
    //       {loggedCompany && (
    //         <NavLink activeClassName="active" to={"/board"}>
    //           Board
    //         </NavLink>
    //       )}
    //       {!loggedCompany && (
    //         <NavLink activeClassName="active" to={"/login"}>
    //           Sign In
    //         </NavLink>
    //       )}
    //       <NavLink activeClassName="active" to={"/about"}>
    //         About
    //       </NavLink>
    //       {loggedCompany && (
    //         <NavLink activeClassName="inactive" onClick={onLogout} to={"/"}>
    //           Logout
    //         </NavLink>
    //       )}
    //     </div>
    //   </div>
    // );
}
