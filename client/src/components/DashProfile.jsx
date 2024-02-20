import { useSelector } from "react-redux"
import { TextInput, Button } from "flowbite-react";

export default function DashProfile() {
    const {crtUser} = useSelector(state => state.user);
  return (
    <div className="max-w-lg mx-auto p-3 w-full">
        <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
        <form className="flex flex-col gap-4">
          <div className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full">
            <img src={crtUser.profilePicture} alt="Profile Picture" className="rounded-full w-full h-full object-cover border-8 border-[lightgrey]" />
          </div>
          <TextInput type="text" id="username" placeholder="Username" defaultValue={crtUser.username}/>
          <TextInput type="text" id="email" placeholder="Email" defaultValue={crtUser.email}/>
          <TextInput type="password" id="password" placeholder="Password" />
          <Button type="submit" gradientDuoTone="purpleToBlue" outline>
            Change
          </Button>
        </form>
        <div className="text-red-500 flex justify-between mt-5">
          <span className="cursor-pointer">Delete Account</span>
          <span className="cursor-pointer">Sign Out</span>
        </div>
    </div>
  );
}
