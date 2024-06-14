"use client";
import React, { useEffect, useState } from 'react';
import { FaCheck, FaPlus } from 'react-icons/fa';
import { toast } from 'sonner';
import { MdDriveFolderUpload } from "react-icons/md";
import { usePathname } from 'next/navigation';
import { Button, Popconfirm } from 'antd';


const UserProfile = () =>
{
    const pathname = usePathname();
    const username = pathname?.split( '/' ).pop()
    const [ isEditing, setIsEditing ] = useState( false );
    const [ user, setUser ] = useState<any>( {} );
    const [ profile, setProfile ] = useState<any>( {} );
    const [ profiles, setProfiles ] = useState<any>( {} );
    const [ likedArticles, setLikedArticles ] = useState<any[]>( [] );


    useEffect( () =>
    {
        fetchProfile();
        fetchProfileUser()
        fetFavorist()

    }, [] );
    const fetFavorist = async () =>
    {
        try
        {
            const favorist = await fetch( `http://localhost:8080/api/articles/locArticles?favorited=${ username }` )
            if ( favorist.ok )
            {
                const data = await favorist.json()
                setLikedArticles( data.articles )
                console.log( data );
            } else (
                toast( "lỗi lấy dữ liệu " )
            )
        } catch ( error: any )
        {
            toast( error.message )
        }
    }
    const fetchProfile = async () =>
    {
        try
        {
            const token = localStorage.getItem( 'token' );


            const response = await fetch( `http://localhost:8080/api/users/profileUser/${ username }`, {
                method: 'GET',
                headers: {
                    Authorization: "Bearer " + token,
                    'Content-Type': 'application/json',
                },
            } );

            if ( !response.ok )
            {
                throw new Error( 'Failed to fetch profile' );
            }
            const data = await response.json();
            console.log( data );

            setProfile( data.profiles ); // Adjusted to access nested profile object
            setUser( data.profiles ); // Set initial user data for editing
        } catch ( error: any )
        {
            toast( error );
        }
    };
    const fetchProfileUser = async () =>
    {
        try
        {
            const storedUser = localStorage.getItem( 'user' );
            const token = localStorage.getItem( 'token' );
            if ( !storedUser )
            {
                throw new Error( 'No user data found in localStorage.' );
            }
            const userObject = JSON.parse( storedUser );
            const username = userObject.username;
            const response = await fetch( `http://localhost:8080/api/users/profile/${ username }`, {
                method: 'GET',
                headers: {
                    Authorization: "Bearer " + token,
                    'Content-Type': 'application/json',
                },
            } );

            if ( response.ok )
            {
                const data = await response.json();
                setProfiles( data.profiles ); // Adjusted to access nested profile object
                setUser( data.profiles );
            } else
            {
                const data = await response.json();
                toast( data.error )
            }

        } catch ( error: any )
        {
            toast( error );
        }
    };
    const isFollowing = profiles?.following?.some( ( followingUser: any ) => followingUser._id === profile._id );
    const handlefollow = async () =>
    {
        const token = localStorage.getItem( "token" )
        try
        {
            const follow = await fetch( `http://localhost:8080/api/users/profile/${ username }/follow`, {
                method: "POST",
                headers: {
                    Authorization: "Bearer " + token,
                    'Content-Type': 'application/json',
                },
            } )
            if ( follow.ok )
            {
                const data = await follow.json();
                toast( "follow người dùng thành công " );
                setProfiles( ( prevProfiles: any ) => ( {
                    ...prevProfiles,
                    following: [ ...prevProfiles.following, { _id: profile._id } ],
                } ) );
                fetchProfile()
            }
            else
            {
                const data = await follow.json();

                toast( data.error )
            }


        } catch ( error )
        {
            console.log( error );


        }

    }
    const handleunfollow = async () =>
    {
        const token = localStorage.getItem( "token" )
        try
        {
            const follow = await fetch( `http://localhost:8080/api/users/profile/${ username }/unfollow`, {
                method: "DELETE",
                headers: {
                    Authorization: "Bearer " + token,
                    'Content-Type': 'application/json',
                },
            } )

            if ( follow.ok )
            {

                const data = await follow.json();
                toast( "unfollow người dùng thành công" );
                setProfiles( ( prevProfiles: any ) => ( {
                    ...prevProfiles,
                    following: prevProfiles.following.filter( ( followingUser: any ) => followingUser._id !== profile._id ),
                } ) );
                fetchProfile()

            }
            else
            {
                const data = await follow.json();
                toast( data.error )
            }



        } catch ( error )
        {
            console.log( error );


        }

    }


    return (
        <div className="container mx-auto p-6">
            <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg relative">
                <h2 className="text-2xl font-bold mb-6 text-center">Hồ sơ người dùng</h2>
                <div className="flex flex-col items-center">
                    <p><strong>Tên người dùng: </strong>{ profile?.username }</p>
                    <p><strong>Email: </strong>{ profile?.email }</p>
                    <p><strong>Giới thiệu: </strong>{ profile?.bio }</p>
                    <div className="mt-4">
                        <Popconfirm
                            title={ isFollowing ? "Hủy follow người dùng?" : "Follow người dùng?" }
                            description={ isFollowing ? "Bạn chắc chắn muốn hủy follow người dùng này?" : "Bạn chắc chắn muốn follow người dùng này?" }
                            okText="Có"
                            cancelText="Không"
                            onConfirm={ isFollowing ? handleunfollow : handlefollow }
                        >
                            <Button danger={ isFollowing } icon={ isFollowing ? <FaCheck /> : <FaPlus /> }>
                                { isFollowing ? 'Followed' : 'Follow' }
                            </Button>
                        </Popconfirm>
                    </div>
                    <div className="mt-4">
                        { profile.image && profile?.image[ 0 ]?.url ? (
                            <img src={ profile?.imageUrl || profile?.image[ 0 ]?.url } alt="Avatar" className="rounded-full h-20 w-20 object-cover" />
                        ) : (
                            <p className="text-gray-500">Người dùng chưa cập nhật ảnh đại diện.</p>
                        ) }
                    </div>
                </div>
            </div>
            <div className="mt-8 bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-6">Bài viết yêu thích</h2>
                { likedArticles.length > 0 ? (
                    <ul>
                        { likedArticles.map( article => (
                            <li key={ article._id } className="mb-4">
                                <h3 className="text-xl font-bold">{ article.title }</h3>
                                <p>{ article.description }</p>
                                <a href={ `/articles/${ article.slug }` } className="text-blue-500 hover:underline">Đọc thêm</a>
                            </li>
                        ) ) }
                    </ul>
                ) : (
                    <p>Người dùng chưa yêu thích bài viết nào.</p>
                ) }
            </div>
        </div>

    );
};

export default UserProfile;
