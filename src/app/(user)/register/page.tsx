'use client';
import React, { useState } from 'react';
import { Auth } from '../../interface/auth';
import { toast } from "sonner"
import { useRouter } from 'next/navigation';

const RegisterPage = () =>
{
    const router = useRouter()
    const [ username, setUsername ] = useState( '' );
    const [ email, setEmail ] = useState( '' );
    const [ password, setPassword ] = useState( '' );
    const [ confirmPassword, setconfirmPassword ] = useState( '' );

    const [ message, setMessage ] = useState( null );


    const handleSubmit = async ( e: React.FormEvent<HTMLFormElement> ) =>
    {
        e.preventDefault();
        const registerdata: Auth = { username, email, password, confirmPassword };
        try
        {
            const response = await fetch( 'http://localhost:8080/api/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify( registerdata ),
            } );
            const data = await response.json();
            console.log( data );
            if ( response.ok )
            {
                toast( data?.message );
                router.push( "/login" )
            } else
            {
                toast( data?.message );
            }
        } catch ( error: any )
        {
            toast( error.message );
        }
    };

    return (
        <div className="container mx-auto p-6">
            <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-6">Đăng ký</h2>
                { message && <div className="mb-4 text-red-500">{ message }</div> }
                <form onSubmit={ handleSubmit }>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">Tên người dùng</label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="username"
                            type="text"
                            placeholder="Nhập tên người dùng"
                            value={ username }
                            onChange={ ( e ) => setUsername( e.target.value ) }
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email</label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="email"
                            type="email"
                            placeholder="Nhập email"
                            value={ email }
                            onChange={ ( e ) => setEmail( e.target.value ) }

                        />
                    </div>
                    <div className="mb-3">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Mật khẩu</label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                            id="password"
                            type="password"
                            placeholder="Nhập mật khẩu"
                            value={ password }
                            onChange={ ( e ) => setPassword( e.target.value ) }

                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Nhập lại Mật khẩu</label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                            id="confirmPassword"
                            type="password"
                            placeholder="Nhập mật khẩu"
                            value={ confirmPassword }
                            onChange={ ( e ) => setconfirmPassword( e.target.value ) }

                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            type="submit"
                        >
                            Đăng ký
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;
