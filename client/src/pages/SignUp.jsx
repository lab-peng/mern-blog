import { Label, TextInput, Button, Alert, Spinner } from 'flowbite-react'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import OAuth from '../components/OAuth'


export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null); 
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() })
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password) {
      return setErrorMessage('All fields are required!');
    }
    try {    
      setLoading(true);
      setErrorMessage(null);                       
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/sign-up`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(formData),
      });
      const data = await res.json();  
      if (data.success === false) {
        setLoading(false);
        return setErrorMessage(data.message);
      }
      if (res.ok) {
        navigate('/sign-in');
       }
    } catch (error) {
         setErrorMessage(error.message);
         setLoading(false);
    }
  }
  return (
  <div className='min-h-screen mt-20'>
    <div className='flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5'>
      {/* left */}
      <div className='flex-1'>
        <Link to='/' className='text-3xl font-bold dark:text-white'>
            <span className='mr-2 px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>Peng</span>
            Liangyu's Blog
        </Link>
        <p className='text-sm mt-5'>
          Here you'll find a variety of articles and tutorials on topics such as web development, software engineering, and programming languages.
        </p>
      </div>
      {/* right */}
      <div className='flex-1'>
        <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
          <div>
            <Label value='Your username' htmlFor='username' />
            <TextInput type='text' placeholder='Username' id='username' autoComplete='true' onChange={handleChange} />
          </div>
          <div>
            <Label value='Your Email' htmlFor='email' />
            <TextInput type='email' placeholder='Example@email.com' id='email' autoComplete='true' onChange={handleChange} />
          </div>
          <div>
            <Label value='Your Password' htmlFor='password' />
            <TextInput type='password' placeholder='Password' id='password' autoComplete='true' onChange={handleChange} />
          </div>
          <Button gradientDuoTone='purpleToPink' type='submit' disabled={loading}>
              {
                loading? (
                <>
                <Spinner size='sm'/>
                <span className='pl-3'>Loading...</span>
                </>
              ) : (
                'Sign Up'
                )
              }
          </Button>
          <OAuth />
        </form>
        <div className='flex gap-2 text-sm mt-5'>
          <span>Already have an account?</span>
          <Link to='/sign-in' className='text-blue-500'>
            Sign In
          </Link>
        </div>
        {
          errorMessage && (
            <Alert className='mt-5' color='failure'>
              {errorMessage}
            </Alert>
          )
        }
      </div>
    </div>
  </div>
  )
}

