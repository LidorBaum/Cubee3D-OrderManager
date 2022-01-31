import React from 'react';

export const Footer = () => {
    return (
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
    );
};
