import Cookies from 'js-cookie';

let userFromCookie = null;
if (Cookies.get('user')) {
    userFromCookie = JSON.parse(Cookies.get('user'));
} else userFromCookie = null;

export default userFromCookie;
