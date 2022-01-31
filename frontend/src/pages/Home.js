import React from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from '@mui/material';

export const Home = () => {
    let history = useHistory();

    const onLogin = () => {
        history.push('/login');
    };

    const onSignup = () => {
        history.push('/login?newCompany=1');
    };
    return (
        <>
            <div className="hero">
                <img src={monitorURL} className="img-monitor" alt="monitor" />
                <div>
                    <p>Welcome to</p>
                    <p>Presence Board</p>
                </div>
            </div>

            <div className="seeking">
                <div>
                    <p>Tired of walking around the office,</p>
                    <p>seeking for specific person?</p>
                </div>
                <img src={seekingURL} className="img-seeking" alt="seeking" />
            </div>

            <div className="solution">
                <img src={powerURL} className="img-power" alt="power" />
                <div>
                    <p>No more!</p>
                    <p>
                        Sign up now and check who is AFK, OOO, and save your
                        time, and power
                    </p>
                </div>
            </div>

            <div className="signup-cta">
                <div className="cta-text">
                    <p>Wanna join with your company?</p>
                    <Button
                        color="success"
                        style={{
                            maxWidth: '200px',
                            maxHeight: '50px',
                            minWidth: '30px',
                            minHeight: '30px',
                        }}
                        variant="contained"
                        onClick={onSignup}
                    >
                        Register Now!
                    </Button>
                </div>
                <img src={joinURL} className="img-signup" alt="signip" />
            </div>

            <div className="signin-cta">
                <img src={signinURL} className="img-signin" alt="signin" />
                <div className="cta-text">
                    <p>Already joined?</p>
                    <Button
                        color="success"
                        style={{
                            maxWidth: '200px',
                            maxHeight: '50px',
                            minWidth: '30px',
                            minHeight: '30px',
                        }}
                        variant="contained"
                        onClick={onLogin}
                    >
                        Log in now!
                    </Button>
                </div>
            </div>
        </>
    );
};
