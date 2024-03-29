import { TextInput, Button, Alert } from "flowbite-react"
import { useSelector, useDispatch } from "react-redux"
import { useState, useRef, useEffect } from "react"
import { getDownloadURL, getStorage, uploadBytesResumable, ref } from "firebase/storage"
import { app } from "../firebase";
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { updateStart, updateSuccess, updateFailure } from '../redux/user/userSlice';


export default function DashProfile() {
    const {crtUser} = useSelector(state => state.user);
    const [imageFile, setImageFile] = useState(null);
    const [imageFileUrl, setImageFileUrl] = useState(null);
    const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
    const [imageFileUploadError, setImageFileUploadError] = useState(null);
    const [formData, setFormData] = useState({});
    // console.log(imageFileUploadProgress, imageFileUploadError);
    const filePickerRef = useRef();
    const dispatch = useDispatch();
    const handleImageChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        setImageFile(file);
        setImageFileUrl(URL.createObjectURL(file));
      }
    };
    // console.log(imageFile, imageFileUrl);
    useEffect(() => {
      if (imageFile) {
        uploadImage();
      }
    }, [imageFile]);

    const uploadImage = async () => {
      // service firebase.storage {
      //   match /b/{bucket}/o {
      //     match /{allPaths=**} {
      //       allow read;
      //       allow write: if 
      //       request.resource.size < 2 * 1024 * 1024 &&
      //       request.resource.contentType.matches('image/.*')
      //     }
      //   }
      // }
      // console.log('uploading image...')
      setImageFileUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + imageFile.name;
      // console.log(new Date().getTime());
      if (!fileName.match(/\.(jpg|jpeg|png|gif)$/i)) {
        setImageFileUploadError('Only image files are allowed!');
        setImageFileUploadProgress(null);
        setImageFile(null);
        setImageFileUrl(null);
        return;
      };
      if (imageFile.size > 2000_000) {
        setImageFileUploadError('File size must not exceed 2 MB!');
        setImageFileUploadProgress(null);
        setImageFile(null);
        setImageFileUrl(null);
        return;
      };
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, imageFile);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageFileUploadProgress(progress.toFixed(0));  // toFixed() method == round() function in Python
        },
        (error) => {
          console.log(error);
          // setImageFileUploadError('It must be an image file and size must not exceed 2 MB!');
          // setImageFileUploadError(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageFileUrl(downloadURL);
            setFormData({...formData, profilePicture: downloadURL});
          });
        }
      );
    };
    const handleChange = (e) => {
      setFormData({...formData, [e.target.id]: e.target.value});
    };
    // console.log(formData);
    const handleSubmit = async (e) => {
      e.preventDefault();
      if (Object.keys(formData).length === 0) {
        return;
      }
      try {
        dispatch(updateStart());
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/update/${crtUser._id}`, {
          method: 'PUT',
          // credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (!res.ok) {
          dispatch(updateFailure(data.message));
        } else {
          dispatch(updateSuccess(data));
        }
      } catch (error) {
        console.log(error, error.message);
        dispatch(updateFailure(error.message));
      }
    };
  return (
    <div className="max-w-lg mx-auto p-3 w-full">
        <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input type="file" accept="image/*" onChange={handleImageChange} ref={filePickerRef} hidden />
          <div className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full" onClick={() => filePickerRef.current.click()}>
            {imageFileUploadProgress && (
              <CircularProgressbar
                value={imageFileUploadProgress || 0}
                text={`${imageFileUploadProgress}%`}
                strokeWidth={5}
                styles={{
                  root: {
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                  },
                  path: {
                    stroke: `rgba(62, 152, 199, ${
                      imageFileUploadProgress / 100
                    })`,
                  },
                }}
              />
            )}
            <img
              src={imageFileUrl || crtUser.profilePicture}
              alt='Profile Picture'
              className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${
                imageFileUploadProgress &&
                imageFileUploadProgress < 100 &&
                'opacity-60'
              }`}
            />
          </div>
          {imageFileUploadError && <Alert color="failure">{imageFileUploadError}</Alert>}
          <TextInput type="text" id="username" placeholder="Username" defaultValue={crtUser.username} onChange={handleChange} />
          <TextInput type="text" id="email" placeholder="Email" defaultValue={crtUser.email} onChange={handleChange} />
          <TextInput type="password" id="password" placeholder="Password" onChange={handleChange} />
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
