'use client';
import { useState } from 'react';
import { Auth } from '../../interface/auth';
import { toast } from 'sonner';
import React from 'react';

const LoginPage = () =>
{

    const [ email, setEmail ] = useState( '' );
    const [ password, setPassword ] = useState( '' );

    const handleSubmit = async ( e: React.FormEvent<HTMLFormElement> ) =>
    {
        e.preventDefault();
        const registerdata: Auth = { email, password };
        try
        {
            const response = await fetch( 'http://localhost:8080/api/users/login', {
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
                localStorage.setItem( 'user', JSON.stringify( data?.user ) );
                localStorage.setItem( 'token', data?.token );
                window.location.href = '/'
                // Redirect to home page
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
                <h2 className="text-2xl font-bold mb-6">Đăng nhập</h2>
                <form onSubmit={ handleSubmit }>
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
                    <div className="flex items-center justify-between">
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                            Đăng nhập
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;

