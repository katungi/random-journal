import Cookies from "js-cookie";

export interface User {
  token: string;
  username: string;
  email: string;
  password: string;
}
// Implement log out function

export async function SignOut() {
  Cookies.remove('user')
  Cookies.remove('token')
  window.location.replace('/')
}