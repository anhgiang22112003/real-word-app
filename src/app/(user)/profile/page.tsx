"use client";
import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrash, FaUserCircle } from 'react-icons/fa';
import { toast } from 'sonner';
import { MdDriveFolderUpload } from "react-icons/md";
import { Button, Modal, Popconfirm } from 'antd';


const UserProfile = () =>
{
    const [ isEditing, setIsEditing ] = useState( false );
    const [ user, setUser ] = useState<any>( {} );
    const [ profile, setProfile ] = useState<any>( {} );
    const [ posts, setPosts ] = useState<any>( [] )
    const [ editPost, setEditPost ] = useState<any>( null ); // Thêm trạng thái cho bài viết đang chỉnh sửa
    const checkPost = posts == "";
    console.log( checkPost );



    const fetchProfile = async () =>
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
                setProfile( data.profiles ); // Adjusted to access nested profile object
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
    const fetchArticleUser = async () =>
    {
        const token = localStorage.getItem( "token" )

        try
        {
            const ArticleUser = await fetch( `http://localhost:8080/api/articles/getArticlesUser`, {
                method: "GET",
                headers: {
                    Authorization: "Bearer " + token,
                    'Content-Type': 'application/json',
                },
            } )
            if ( ArticleUser.ok )
            {
                const data = await ArticleUser.json()

                setPosts( data )

            } else
            {
                toast( "lỗi lấy dữ liệu" )
            }

        } catch ( error )
        {
            console.log( error );

        }
    }
    const handleConfirmDelete = async ( slug: any ) =>
    {
        const token = localStorage.getItem( "token" )
        try
        {
            const remove = await fetch( `http://localhost:8080/api/articles/deleteSlug/${ slug }`, {
                method: "DELETE",
                headers: {
                    Authorization: "Bearer " + token,
                    "Content-Type": "application/json",
                }
            } )
            if ( remove.ok )
            {
                const data = await remove.json()
                fetchArticleUser();
                toast( data.message )
            }
            else
            {
                const data = await remove.json()

                toast( data.message )
            }

        } catch ( error )
        {
            console.log( error );

        }
    }
    const handleEditClick = () =>
    {
        setIsEditing( !isEditing );
    };
    const handleEditPostClick = ( post: any ) =>
    {
        setEditPost( post ); // Đặt bài viết đang chỉnh sửa
    };
    const handleChange = ( e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> ) =>
    {
        const { id, value } = e.target;
        setUser( { ...user, [ id ]: value } );
    };
    const handleFileChange = ( e: React.ChangeEvent<HTMLInputElement> ) =>
    {
        const file = e.target.files?.[ 0 ];
        if ( file )
        {
            setUser( { ...user, image: file } );
            const imageUrl = URL.createObjectURL( file );
            setProfile( { ...profile, imageUrl } );
        }
    };
    const handleSubmit = async ( e: React.FormEvent<HTMLFormElement> ) =>
    {
        e.preventDefault();

        try
        {
            const token = localStorage.getItem( 'token' );
            const formData = new FormData();
            formData.append( 'username', user.username );
            formData.append( 'email', user.email );
            formData.append( 'bio', user.bio );
            if ( user.image )
            {
                formData.append( 'image', user.image );
            }

            const response = await fetch( 'http://localhost:8080/api/users/updateUser', {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${ token }`,
                },
                body: formData,
            } );

            if ( !response.ok )
            {
                const data = await response.json();
                toast( data.message )
            }
            const data = await response.json();

            localStorage.setItem( 'user', JSON.stringify( data?.user ) );
            toast( data?.message )

            setProfile( data.user );
            setIsEditing( false );
        } catch ( error )
        {

            console.log( error );

        }
    };
    const handleEditPostChange = ( e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> ) =>
    {
        const { id, value } = e.target;
        setEditPost( { ...editPost, [ id ]: value } );
    };
    const handleEditPostSubmit = async ( slug: string ) =>
    {
        const token = localStorage.getItem( 'token' );
        try
        {
            const response = await fetch( `http://localhost:8080/api/articles/updatetitle/${ slug }`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${ token }`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify( editPost ),
            } );

            if ( response.ok )
            {
                const data = await response.json();
                fetchArticleUser(); // Cập nhật lại danh sách bài viết sau khi chỉnh sửa
                toast( "chỉnh sửa bài viết thành công " );
                setEditPost( null ); // Đóng form chỉnh sửa
            } else
            {
                const data = await response.json();
                toast( data.message );
            }
        } catch ( error )
        {
            console.log( error );
        }
    };
    useEffect( () =>
    {
        fetchArticleUser();
        fetchProfile();
    }, [] );

    return (
        <div className="container mx-auto p-6">
            <div className="grid grid-cols-4 gap-6">
                {/* User Profile Section */ }
                <div className="col-span-1">
                    <div className="max-w-md bg-white p-8 rounded-lg shadow-lg relative">
                        <h2 className="text-2xl font-bold mb-6">Hồ sơ người dùng</h2>
                        { isEditing ? (
                            <form onSubmit={ handleSubmit }>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                                        Tên người dùng
                                    </label>
                                    <input
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="username"
                                        type="text"
                                        value={ user.username || '' }
                                        onChange={ handleChange }
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                        Email
                                    </label>
                                    <input
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="email"
                                        type="email"
                                        value={ user.email || '' }
                                        onChange={ handleChange }
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="bio">
                                        Giới thiệu
                                    </label>
                                    <textarea
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                                        id="bio"
                                        value={ user.bio || '' }
                                        onChange={ handleChange }
                                        required
                                    ></textarea>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="avatar">
                                        Ảnh đại diện
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={ handleFileChange }
                                        id="avatar"
                                        className="hidden"
                                    />
                                    <label
                                        htmlFor="avatar"
                                        className="cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline inline-block"
                                    >
                                        <MdDriveFolderUpload />
                                    </label>
                                    { profile.imageUrl && (
                                        <div className="mt-4">
                                            <img src={ profile.imageUrl } alt="Avatar Preview" className="rounded-full h-20 w-20 object-cover" />
                                        </div>
                                    ) }
                                </div>
                                <div className="flex items-center justify-between">
                                    <button
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                        type="submit"
                                    >
                                        Cập nhật
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div>
                                <p>
                                    <strong>Tên người dùng: </strong> { profile?.username }
                                </p>
                                <p>
                                    <strong>Email: </strong> { profile?.email }
                                </p>
                                <p>
                                    <strong>Giới thiệu: </strong> { profile?.bio }
                                </p>
                                <p>
                                    <strong>Following: </strong> { profile?.following?.length }
                                </p>
                                { profile?.image && profile?.image[ 0 ]?.url ? (
                                    <img
                                        src={ profile?.image[ 0 ]?.url }
                                        alt="Avatar"
                                        className="mt-4 rounded-full h-20 w-20 object-cover"
                                    />
                                ) : (
                                    <p className="mt-4 text-gray-500">
                                        Bạn chưa cập nhật ảnh đại diện.
                                        <FaUserCircle className="w-10 h-10 text-gray-800" />
                                    </p>
                                ) }

                            </div>
                        ) }
                        <button
                            className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
                            onClick={ handleEditClick }
                        >
                            <FaEdit size={ 24 } />
                        </button>
                    </div>
                </div>

                {/* Posts Section */ }
                <div className="col-span-3">
                    <div className="bg-white p-8 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-bold mb-6">Bài viết đã đăng</h2>
                        { checkPost ? (
                            <p>Bạn chưa đăng bài viết nào </p>
                        ) : (
                            <div>
                                { posts?.map( ( post: any ) => (
                                    <div key={ post.id } className="mb-4 relative border-b pb-4">
                                        <h3 className="text-xl font-bold">{ post.title }</h3>
                                        <p className="text-gray-700">{ post.body }</p>
                                        <div className="absolute top-0 right-0 flex">
                                            <Popconfirm
                                                title="Xóa bài viết"
                                                description="Bạn có muốn xóa bài viết này không?"
                                                okText="Có"
                                                onConfirm={ () => handleConfirmDelete( post.slug ) }
                                                cancelText="Không"
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <Button type="link" className="p-2">
                                                    <FaTrash />
                                                </Button>
                                            </Popconfirm>
                                            <Button
                                                type="link"
                                                className="p-2 text-blue-500 hover:text-blue-700"
                                                onClick={ () => handleEditPostClick( post ) }
                                            >
                                                <FaEdit />
                                            </Button>
                                        </div>
                                    </div>
                                ) ) }
                            </div>
                        ) }

                    </div>
                </div>
            </div>

            {/* Edit Post Modal */ }
            { editPost && (
                <Modal
                    title="Chỉnh sửa bài viết"
                    visible={ !!editPost }
                    onCancel={ () => setEditPost( null ) }
                    onOk={ () => handleEditPostSubmit( editPost.slug ) }
                >
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                            Tiêu đề
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="title"
                            type="text"
                            value={ editPost.title }
                            onChange={ handleEditPostChange }
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="body">
                            Nội dung
                        </label>
                        <textarea
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                            id="body"
                            value={ editPost.body }
                            onChange={ handleEditPostChange }
                            required
                        ></textarea>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="body">
                            Chi tiết
                        </label>
                        <textarea
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                            id="description"
                            value={ editPost.description }
                            onChange={ handleEditPostChange }
                            required
                        ></textarea>
                    </div>
                </Modal>
            ) }
        </div>
    );
};

export default UserProfile;
