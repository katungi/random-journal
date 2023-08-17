import { HomeIcon, PenIcon } from "../assets/icons/Icons";
import TileEditor from "./nav-tiles";

export default function NavBar() {
  return (
    <div className='flex flex-row space-x-3 w-full justify-center mb-4'>
      <a href='/'>
        <TileEditor icn={<HomeIcon />} />
      </a>
      <a href='/jot'>
        <TileEditor icn={<PenIcon />} />
      </a>

    </div>
  )
}