"use client"
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { IoIosLogOut } from "react-icons/io";
import { FaUserCircle } from 'react-icons/fa';
import { AiOutlineEdit } from "react-icons/ai";

const Header = ( { } ) =>
{
    const router = useRouter()
    const [ isLoggedIn, setIsLoggedIn ] = useState( false );
    const [ user, setUser ] = useState<any>( { name: '', avatar: '' } );

    useEffect( () =>
    {

        const token = localStorage.getItem( 'token' );
        const storedUser = localStorage.getItem( 'user' );

        if ( token && storedUser )
        {
            setIsLoggedIn( true );
            setUser( JSON.parse( storedUser ) );
            // Reload lại trang khi có token trong localStorage
        }
    }, [] );

    const handleLogout = () =>
    {
        localStorage.removeItem( 'token' );
        localStorage.removeItem( 'user' );
        setIsLoggedIn( false );
        setUser( { name: '', avatar: '' } );
        router.push( '/login' );
    };

    return (
        <div>
            <div className="bg-blue-500 text-white py-10">
                <div className="container mx-auto px-6">
                    <h1 className="text-4xl font-bold">Chào mừng đến với MyWebsite</h1>
                    <p className="mt-2 text-lg">Nơi bạn có thể tìm thấy những bài viết thú vị và bổ ích.</p>
                </div>
            </div>
            <nav className="bg-white shadow-lg">
                <div className="container mx-auto px-6 py-3">
                    <div className="flex justify-between items-center">
                        <div className="text-2xl font-bold text-gray-800">
                            <a href="/" className="text-gray-800 hover:text-gray-600">MyWebsite</a>
                        </div>
                        {/* <div className="flex space-x-4">
                            <Link href="/articleCard" className="text-gray-800 hover:text-gray-600">Đăng bài</Link>

                        </div> */}
                        <div className="flex items-center space-x-4">
                            { isLoggedIn ? (
                                <>
                                    <Link href="/articleCard" className="text-gray-800 hover:text-gray-600"><AiOutlineEdit />
                                    </Link>

                                    <Link href="/profile">
                                        { user?.image && user?.image[ 0 ]?.url ? (
                                            <img src={ user?.image[ 0 ]?.url } alt="Avatar" className="w-10 h-10 rounded-full" />
                                        ) : (
                                            <FaUserCircle className="w-10 h-10 text-gray-800" />
                                        ) }
                                    </Link>
                                    <span className="text-gray-800">{ user?.username }</span>
                                    <button onClick={ handleLogout } className="text-gray-800 hover:text-gray-600 px-3 py-2 bg-red-500 border rounded">
                                        <IoIosLogOut />
                                    </button>
                                </>
                            ) : (
                                <>
                                    <a href="/login" className="text-gray-800 hover:text-gray-600 px-3 py-2 border rounded">Đăng nhập</a>
                                    <a href="/register" className="text-white bg-blue-500 hover:bg-blue-700 px-3 py-2 rounded ml-2">Đăng ký</a>
                                </>
                            ) }
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    );
}

export default Header;