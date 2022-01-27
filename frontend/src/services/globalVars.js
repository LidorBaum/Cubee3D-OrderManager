import Cookies from 'js-cookie';
let userFromCookie = null;

console.log('getting useer from cookie');
if (Cookies.get('user')) {
    userFromCookie = JSON.parse(Cookies.get('user'));
} else userFromCookie = null;

export default userFromCookie;
