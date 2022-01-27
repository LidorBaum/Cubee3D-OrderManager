import React, { useContext, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import { useHistory } from 'react-router-dom';
import { SnackbarHandlerContext } from '../contexts/SnackbarHandlerContext';
import userService from '../services/userService';

export const Footer = props => {
    let history = useHistory();
    const notificationHandler = useContext(SnackbarHandlerContext);

    return (
        // <div className='header'>
        <footer>
            <p>App developed by EchoShop3D</p>
            <div className="footer-icons">
                <a
                    target="_blank"
                    href="https://www.cubee3d.com/store/EchoShop"
                >
                    <img
                        alt="echoshop"
                        src={
                            'https://res.cloudinary.com/echoshare/image/upload/v1636287815/echo_icon_q1hjeb.png'
                        }
                    />
                </a>
                <a target="_blank" href="https://www.github.com/lidorbaum/">
                    <img
                        alt="github"
                        src={
                            'https://res.cloudinary.com/echoshare/image/upload/v1636287018/github_epexfw.svg'
                        }
                    />
                </a>
            </div>
        </footer>
        //    {/* {store && <img src='https://res.cloudinary.com/echoshare/image/upload/v1642465658/Cubee3D/61995740_2245317985550489_7473695634269143040_n_pr2m2w.jpg' />} */}
        //{/* </div> */}
    );
};
