import {motion} from "framer-motion";
import { useState } from "react";
import Input from "../components/Input";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthStore } from "../store/authStore.js";
import toast from "react-hot-toast";
import { Lock } from "lucide-react";

const ResetPasswordPage = () => {
    const[password, setpassword] = useState("");
    const[confirmpassword, setconfirmpassword] = useState("");

    const {token} = useParams();
    const navigate = useNavigate();

    const {resetPassword, error, isLoading, message} = useAuthStore();

    const handlesubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmpassword) {
			toast.error("Passwords do not match");
			return;
		}

        try {
            const res = await resetPassword(token, password);

            if(res.success){
                toast.success(res.message);
			setTimeout(() => {
				navigate("/login");
			}, 2000);
            }else{
                toast.error(res.message);
            }
        } catch (error) {
            console.error(error);
			toast.error(error.message);
        }
    }

  return (
    <motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className='max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden'
		>
            <div className='p-8'>
				<h2 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-400 to-blue-500 text-transparent bg-clip-text'>
					Reset Password
				</h2>

                {error && <p className='text-red-500 text-sm mb-4'>{error}</p>}
				{message && <p className='text-blue-500 text-sm mb-4'>{message}</p>}

                <form onSubmit={handlesubmit}>
					<Input
						icon={Lock}
						type='password'
						placeholder='New Password'
						value={password}
						onChange={(e) => setpassword(e.target.value)}
						required
					/>

					<Input
						icon={Lock}
						type='password'
						placeholder='Confirm New Password'
						value={confirmpassword}
						onChange={(e) => setconfirmpassword(e.target.value)}
						required
					/>

					<motion.button
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						className='w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-lg shadow-lg hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200'
						type='submit'
						disabled={isLoading}
					>
						{isLoading ? "Resetting..." : "Set New Password"}
					</motion.button>
				</form>
            </div>
        </motion.div>
  )
}

export default ResetPasswordPage