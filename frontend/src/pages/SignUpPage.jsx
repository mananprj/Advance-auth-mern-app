import {motion} from "framer-motion";
import Input from "../components/Input";
import {Loader, Lock, Mail, User} from "lucide-react"
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter";
import { useAuthStore } from "../store/authStore.js";
import toast from "react-hot-toast";

const SignUpPage = () => {
  const[name, setname] = useState("");
  const[email, setemail] = useState("");
  const[password, setpassword] = useState("");
  const {signUp, error,  isLoading} = useAuthStore();
  const navigate = useNavigate();
  
  const handlesignup = async (e) => {
	e.preventDefault();
	try {
		const res = await signUp(email, password, name);

		if(res.success){
			navigate("/verify-email");
			toast.success(res.message);
		}else{
			toast.error(res.message);
		}
	} catch (error) {
		console.log(error);
	}
};

  return (
    <motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className='max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl 
			overflow-hidden'
		>

      <div className='p-8'>
        <h2 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-400 to-blue-500 text-transparent bg-clip-text'>
					Create Account
				</h2>

        <form onSubmit={handlesignup}>
        			<Input
						icon={User}
						type='text'
						placeholder='Full Name'
						value={name}
						onChange={(e) => setname(e.target.value)}
					/>
					<Input
						icon={Mail}
						type='email'
						placeholder='Email Address'
						value={email}
						onChange={(e) => setemail(e.target.value)}
					/>
					<Input
						icon={Lock}
						type='password'
						placeholder='Password'
						value={password}
						onChange={(e) => setpassword(e.target.value)}
					/>

				{error && <p className='text-red-500 font-semibold mt-2'>{error}</p>}


          		<PasswordStrengthMeter password={password} />

          <motion.button
						className='mt-5 w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white 
						font-bold rounded-lg shadow-lg hover:from-blue-600
						hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
						 focus:ring-offset-gray-900 transition duration-200'
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						type='submit'
						disabled={isLoading}
					>
						{isLoading ? <Loader className=' animate-spin mx-auto' size={24} /> : "Sign Up"}
					</motion.button>
        </form>
      </div>

      <div className='px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center'>
				<p className='text-sm text-gray-400'>
					Already have an account?{" "}
					<Link to={"/login"} className='text-blue-400 hover:underline'>
						Login
					</Link>
				</p>
			</div>
    </motion.div>
  )
}

export default SignUpPage