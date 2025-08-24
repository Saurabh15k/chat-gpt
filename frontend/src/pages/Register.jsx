import { useForm } from 'react-hook-form';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';

const Register = () => {
    const navigate = useNavigate();
    const { register, handleSubmit } = useForm({
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: ""
        },
    });

    const onSubmit = (data) => {
        axios.post('http://localhost:3000/auth/register', {
            fullName:{
                firstName: data.firstName,
                lastName: data.lastName
            },
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
            <div className="w-full max-w-md bg-white shadow-xl rounded-3xl p-8 flex flex-col items-center gap-4">
                <h4 className="text-3xl font-bold text-gray-800 mb-2">Register Now</h4>
                <p className="mb-4 text-gray-500 text-center">You’ll get smarter responses</p>
                <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-5">
                    <div className="flex gap-4">
                        <div className="flex flex-col w-1/2">
                            <label htmlFor="firstName" className="text-sm font-semibold text-gray-700 mb-1">First Name</label>
                            <input className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400" type="text" id="firstName" name="firstName" placeholder="First Name" {...register("firstName")} />
                        </div>
                        <div className="flex flex-col w-1/2">
                            <label htmlFor="lastName" className="text-sm font-semibold text-gray-700 mb-1">Last Name</label>
                            <input className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400" type="text" id="lastName" name="lastName" placeholder="Last Name" {...register("lastName")} />
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="email" className="text-sm font-semibold text-gray-700 mb-1">Email</label>
                        <input className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400" type="email" id="email" name="email" placeholder="Email" {...register("email")} />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="password" className="text-sm font-semibold text-gray-700 mb-1">Password</label>
                        <input className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400" type="password" id="password" name="password" placeholder="Password" {...register("password")} />
                    </div>
                    <button type="submit" className="mt-2 py-2 px-4 bg-purple-600 text-white font-bold rounded-lg shadow hover:bg-purple-700 transition-colors">Sign Up</button>
                </form>
                <div className="mt-4 text-center">
                    <span className="text-gray-600 text-sm">Already have an account? </span>
                    <a href="/login" className="text-purple-600 font-semibold hover:underline">Login</a>
                </div>
            </div>
        </div>
    );
}

export default Register
