import axios from 'axios';
import { useForm } from 'react-hook-form';
import {useNavigate} from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const { register, handleSubmit } = useForm({
        defaultValues: {
            email: '',
            password: ''
        },
    });

    const onSubmit = (data) => {
        axios.post('http://localhost:3000/auth/login', {
            email: data.email,
            password: data.password
        },{
            withCredentials: true
        })
        navigate('/');
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 relative flex-col">
            <h4 className="absolute top-6 left-8 font-bold text-2xl text-black tracking-wide">chatGPT</h4>
            <div className="w-full max-w-md bg-white shadow-xl rounded-3xl p-6 sm:p-8 flex flex-col items-center gap-4 mx-2">
                <h4 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Welcome back!</h4>
                <p className="mb-4 text-gray-500 text-center text-sm sm:text-base"> Login in to continue</p>
                <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-4 sm:gap-5">
                    <div className="flex flex-col">
                        <label htmlFor="email" className="text-sm font-semibold text-gray-700 mb-1">Email</label>
                        <input className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400" type="email" id="email" name="email" placeholder="Email" {...register("email")} />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="password" className="text-sm font-semibold text-gray-700 mb-1">Password</label>
                        <input className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400" type="password" id="password" name="password" placeholder="Password" {...register("password")} />
                    </div>
                    <button type="submit" className="mt-2 py-2 px-4 bg-purple-600 text-white font-bold rounded-lg shadow hover:bg-purple-700 transition-colors text-base sm:text-lg">Continue</button>
                </form>
                <div className="mt-4 text-center">
                    <span className="text-gray-600 text-sm">Don't have an account? </span>
                    <a href="/register" className="text-purple-600 font-semibold hover:underline">Register</a>
                </div>
            </div>
        </div>
    );
}

export default Login
