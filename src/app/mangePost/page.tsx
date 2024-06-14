"use client"
import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

// const ManagePostsPage = () =>
// {
//     // const router = useRouter();
//     const [ posts, setPosts ] = useState( [] );
//     const [ isLoading, setIsLoading ] = useState( true );
//     const [ error, setError ] = useState( null );

//     useEffect( () =>
//     {
//         const fetchPosts = async () =>
//         {
//             try
//             {
//                 const response = await fetch( '/api/posts' ); // Đổi '/api/posts' thành đường dẫn của API hoặc endpoint của cơ sở dữ liệu
//                 if ( !response.ok )
//                 {
//                     throw new Error( 'Failed to fetch posts' );
//                 }
//                 const data = await response.json();
//                 setPosts( data );
//                 setIsLoading( false );
//             } catch ( error )
//             {
//                 setError( error );
//                 setIsLoading( false );
//             }
//         };
//         fetchPosts();
//     }, [] );

//     if ( isLoading ) return <div>Loading...</div>;
//     if ( error ) return <div>Error: { error.message }</div>;

//     const handleEditClick = ( postId: any ) =>
//     {
//         router.push( `/posts/${ postId }/edit` );
//     };

//     const handleDeleteClick = async ( postId: any ) =>
//     {
//         // Thực hiện xóa bài viết ở đây
//         // Sau khi xóa, cập nhật danh sách bài viết hoặc chuyển hướng đến trang mới
//     };

//     return (
//         <div>
//             <h1>Manage Your Posts</h1>
//             <ul>
//                 { posts.map( ( post: any ) => (
//                     <li key={ post.id }>
//                         <h2>{ post.title }</h2>
//                         <p>{ post.content }</p>
//                         <button onClick={ () => handleEditClick( post.id ) }>Edit</button>
//                         <button onClick={ () => handleDeleteClick( post.id ) }>Delete</button>
//                     </li>
//                 ) ) }
//             </ul>
//         </div>
//     );
// };


const ManagePostsPage = () =>
{

    // Mảng dữ liệu bài viết giả định
    const posts = [
        { id: 1, title: 'Bài viết 1', content: 'Nội dung bài viết 1' },
        { id: 2, title: 'Bài viết 2', content: 'Nội dung bài viết 2' },
        { id: 3, title: 'Bài viết 3', content: 'Nội dung bài viết 3' },
    ];

    const [ postss, setPosts ] = useState( [] );
    const [ isLoading, setIsLoading ] = useState( true );
    const [ error, setError ] = useState( null );
    console.log( postss );

    useEffect( () =>
    {
        const fetchPosts = async () =>
        {
            try
            {
                const response = await fetch( ' http://localhost:8080/api/articles/gettags' ); // Đổi '/api/posts' thành đường dẫn của API hoặc endpoint của cơ sở dữ liệu
                if ( !response.ok )
                {
                    throw new Error( 'Failed to fetch posts' );
                }
                const data = await response.json();
                setPosts( data );
                setIsLoading( false );
            } catch ( error: any )
            {
                setError( error );
                setIsLoading( false );
            }
        };
        fetchPosts();
    }, [] );

    if ( isLoading ) return <div>Loading...</div>;
    if ( error ) return <div>Error: { error.message }</div>;
    const handleEditClick = ( postId ) =>
    {
        // Xử lý khi người dùng nhấn chỉnh sửa
        console.log( 'Edit post with ID:', postId );
    };

    const handleDeleteClick = ( postId ) =>
    {
        // Xử lý khi người dùng nhấn xóa
        console.log( 'Delete post with ID:', postId );
        // Thêm logic xóa bài viết ở đây
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Manage Your Posts</h1>
            <ul className="space-y-4">
                { posts.map( ( post ) => (
                    <li key={ post.id } className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-semibold mb-2">{ post.title }</h2>
                        <p className="text-gray-700 mb-4">{ post.content }</p>
                        <div className="flex space-x-4">
                            <button
                                onClick={ () => handleEditClick( post.id ) }
                                className="flex items-center text-white bg-blue-500 hover:bg-blue-700 px-4 py-2 rounded"
                            >
                                <FaEdit className="mr-2" />
                                Chỉnh sửa
                            </button>
                            <button
                                onClick={ () => handleDeleteClick( post.id ) }
                                className="flex items-center text-white bg-red-500 hover:bg-red-700 px-4 py-2 rounded"
                            >
                                <FaTrash className="mr-2" />
                                Xóa
                            </button>
                        </div>
                    </li>
                ) ) }
            </ul>
        </div>
    );
};

export default ManagePostsPage;
