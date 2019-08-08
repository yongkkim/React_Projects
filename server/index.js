import Cookies from 'universal-cookie';

const cookies = new Cookies(req.headers.cookie);

console.log(cookies.get('todos'));