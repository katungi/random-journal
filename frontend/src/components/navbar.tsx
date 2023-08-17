import { HomeIcon, PenIcon } from "../assets/icons/Icons";
import { SignOut } from "../hooks/useUser";
import TileEditor from "./nav-tiles";
import Cookies from "js-cookie";

export default function NavBar() {
  const cookieData = Cookies.get('user');
  const user = cookieData ? JSON.parse(cookieData).user : null;
  return (
    <div className='flex flex-row space-x-3 w-full justify-center mb-4'>
      <a href='/'>
        <TileEditor icn={<HomeIcon />}  />
      </a>
      <a href='/jot'>
        <TileEditor icn={<PenIcon />} />
      </a>
      <div className='mx-8 my-4'>
        {user ?
          <div className="flex flex-row justify-evenly">
            <p className='font-bold font-lg mr-8'>Hello {user?.username} :-)</p>
            <p className='cursor-pointer text-bold underline decoration-wavy decoration-[#FCDAAB]'
              onClick={SignOut}
            >Sign Out</p>
          </div> :
          <a href='/login' className="cursor-pointer text-bold underline decoration-wavy decoration-[#FCDAAB]">
            <p>Sign In</p>
          </a>
        }
      </div>
    </div>
  )
}