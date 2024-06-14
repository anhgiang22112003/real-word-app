"use client";
import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { toast } from 'sonner';
import { FaCheck, FaHeart, FaPlus, FaThumbsDown, FaTrash, FaUserCircle } from 'react-icons/fa';
import { Button, Popconfirm } from 'antd';
import { log } from 'console';
import Link from 'next/link';

const ArticleDetail = () =>
{
    const pathname = usePathname();
    const slug = pathname?.split( '/' ).pop(); // Lấy slug từ URL

    const [ article, setArticle ] = useState<any>( null );
    const [ newComment, setNewComment ] = useState( '' );
    const [ loading, setLoading ] = useState( false );
    const [ profiles, setProfiles ] = useState<any>( {} );
    console.log( profiles );

    const fetchArticle = async () =>
    {
        try
        {

            const response = await fetch( `http://localhost:8080/api/articles/getslug/${ slug }` );
            if ( !response.ok )
            {
                throw new Error( 'Lỗi lấy dữ liệu' );
            }
            const data = await response.json();


            setArticle( data.getslug );
        } catch ( error: any )
        {
            toast( error.message );
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
    const isFollowing = profiles?.following?.some( ( followingUser: any ) => followingUser._id === article?.author?._id );
    console.log( isFollowing );

    useEffect( () =>
    {
        fetchArticle();
        fetchProfileUser()
    }, [ slug ] );
    const handlefollow = async () =>
    {
        const token = localStorage.getItem( "token" )
        const username = article?.author?.username
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
                toast( "follow thành công" );
                setProfiles( ( prevProfiles: any ) => ( {
                    ...prevProfiles,
                    following: [ ...prevProfiles.following, { _id: article?.author?._id._id } ],
                } ) );
                fetchProfileUser()

                console.log( data );
            } else
            {
                const data = await follow.json();
                toast( data.message );
            }

        } catch ( error: any )
        {
            toast( error.message );


        }

    }
    const handleunfollow = async () =>
    {
        const token = localStorage.getItem( "token" )
        const username = article?.author?.username

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
                toast( "unfollow thành công " );
                setProfiles( ( prevProfiles: any ) => ( {
                    ...prevProfiles,
                    following: prevProfiles.following.filter( ( followingUser: any ) => followingUser._id !== article?.author?._id._id ),
                } ) );
                fetchProfileUser()
            } else
            {
                const data = await follow.json();
                toast( data.message );
            }



        } catch ( error: any )
        {
            toast( error.message )

        }

    }
    const handleAddComment = async ( e: React.FormEvent ) =>
    {
        e.preventDefault();
        if ( newComment.trim() === '' )
        {
            toast( 'Comment không được để trống' );
            return;
        }
        const token = localStorage.getItem( "token" );
        const newCommentData = {
            body: newComment,
        };

        try
        {
            const response = await fetch( `http://localhost:8080/api/comment/${ slug }/comment`, {
                method: 'POST',
                headers: {
                    Authorization: "Bearer " + token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify( newCommentData ),
            } );
            const data = await response.json();

            if ( response.ok )
            {
                toast( "bình luận thành công " );
                // Load lại dữ liệu của bài viết sau khi gửi bình luận mới
                fetchArticle();
                setNewComment( '' );
            } else
            {
                toast( data?.message );
            }
        } catch ( error: any )
        {
            toast( error.message );
        }
    };

    const handleConfirmDelete = async ( id: any ) =>
    {
        try
        {
            const token = localStorage.getItem( "token" );
            const deleteComment = await fetch( `http://localhost:8080/api/comment/${ slug }/comment/${ id }`, {
                method: "DELETE",
                headers: {
                    Authorization: "Bearer " + token,
                    'Content-Type': 'application/json',
                }
            } );

            if ( deleteComment.ok )
            {
                const data = await deleteComment.json();
                fetchArticle();
                toast( "Bình luận đã được xóa thành công" );
            } else
            {
                // Hiển thị thông báo lỗi
                toast( "Lỗi xóa bình luận" );
            }
        } catch ( error )
        {
            console.log( error );
            toast( "Lỗi xóa bình luận" );
        }
    };

    const handleFavorits = async () =>
    {
        const token = localStorage.getItem( "token" )
        try
        {
            const favorists = await fetch( `http://localhost:8080/api/articles/${ slug }/favorite`, {
                method: "POST",
                headers: {
                    Authorization: "Bearer " + token,
                    'Content-Type': 'application/json',
                },
            } )

            if ( favorists.ok )
            {

                const data = await favorists.json();
                toast( data.message );
                fetchArticle()

                console.log( data );
            }
            else
            {
                toast( "lỗi yêu thích bài viết " )
            }

        } catch ( error: any )
        {
            toast( error.message )


        }
    }
    const handleunFavorits = async () =>
    {
        const token = localStorage.getItem( "token" )
        try
        {
            const favorists = await fetch( `http://localhost:8080/api/articles/${ slug }/favorite`, {
                method: "DELETE",
                headers: {
                    Authorization: "Bearer " + token,
                    'Content-Type': 'application/json',
                },
            } )
            console.log( favorists );

            if ( favorists.ok )
            {
                const data = await favorists.json();

                toast( data.message );
                fetchArticle()

            } else
            {
                const data = await favorists.json();

                toast( data?.message )
            }
        } catch ( error: any )
        {
            toast( error.message )


        }
    }
    if ( loading )
    {
        return <div>Loading...</div>;
    }

    if ( !article )
    {
        return <div>Loading...</div>;
    }
    const user = localStorage.getItem( "user" );
    const usernameUser = user ? JSON.parse( user ).username : null;


    return (
        <div className="container mx-auto p-6">
            <div className="bg-white p-8 rounded-lg shadow-lg">
                <h1 className="text-4xl font-bold mb-4">{ article.title }</h1>
                <div className="flex items-center space-x-4 mb-4">
                    { article?.author?.image && article?.author?.image[ 0 ]?.url ? (
                        <img src={ article?.author?.image[ 0 ]?.url } alt="Author" className="w-10 h-10 rounded-full" />

                    ) : (
                        <p className=" text-gray-500">
                            <FaUserCircle className="w-10 h-10 text-gray-800" />
                        </p>
                    ) }

                    <div >
                        <div className='flex flex-row '>
                            <Link className='mr-2' href={ `/profileUser/${ article?.author?.username }` }> <p className="text-gray-700 font-bold">
                                { article?.author?.username === usernameUser ? "Tác giả: Tôi" : article?.author?.username }

                            </p>
                            </Link>
                            { article?.author?.username !== usernameUser && (
                                <Button
                                    className='px-2'
                                    danger={ isFollowing }
                                    icon={ isFollowing ? <FaCheck /> : <FaPlus /> }
                                    onClick={ isFollowing ? handleunfollow : handlefollow }
                                >
                                    { isFollowing ? 'Followed' : 'Follow' }
                                </Button>
                            ) }
                        </div>
                        <p className="text-gray-500 text-sm">{ new Date( article?.createdAt ).toLocaleDateString() }</p>
                    </div>
                </div>
                <div className="text-gray-700 leading-relaxed mb-6">
                    { article?.body }
                </div>
                <div className="text-gray-700 leading-relaxed mb-6">
                    { article?.description }
                </div>
                <div className="flex items-center space-x-4">
                    <button
                        onClick={ handleFavorits }
                        className={ `flex items-center ${ article?.favorited ? 'text-red-500 hover:text-red-700' : 'text-gray-500 hover:text-gray-700' }` }
                    >
                        <FaHeart className="mr-2" /> { article?.favoritesCount }
                    </button>
                    <button
                        onClick={ handleunFavorits }
                        className={ `flex items-center ${ !article?.favorited ? 'text-blue-500 hover:text-blue-700' : 'text-gray-500 hover:text-gray-700' }` }
                    >
                        <FaThumbsDown className="mr-2" /> Dislike
                    </button>
                </div>
                <div className="mt-6">
                    <h2 className="text-2xl font-bold mb-4">Comments</h2>
                    { article?.comments?.map( ( comment: any, index: number ) => (
                        <div key={ index } className="mb-4 relative">
                            <div className="flex items-center space-x-4 mb-2">
                                { comment?.author && comment?.author?.image ? (
                                    <img src={ comment?.author?.image } alt="Comment Author" className="w-8 h-8 rounded-full" />

                                ) : (
                                    <p className=" text-gray-500">
                                        <FaUserCircle className="w-10 h-10 text-gray-800" />
                                    </p>
                                ) }
                                <div>
                                    <p className="text-gray-700 font-bold">{ comment?.author?.username }</p>
                                    <p className="text-gray-500 text-sm">{ new Date( comment?.createdAt ).toLocaleDateString() }</p>
                                </div>
                            </div>
                            <p className="text-gray-700">{ comment?.body }</p>


                            <Popconfirm
                                title="xóa comment"
                                description="Bạn có muốn xóa comment"
                                okText="có"
                                onConfirm={ () => handleConfirmDelete( comment?._id ) }
                                cancelText="không"
                                className="absolute right-0 bottom-0 text-red-500 hover:text-red-700"
                            >
                                <Button><FaTrash /></Button>
                            </Popconfirm>
                        </div>
                    ) ) }
                </div>
                <form onSubmit={ handleAddComment } className="mt-6">
                    <input
                        type="text"
                        value={ newComment }
                        onChange={ ( e ) => setNewComment( e.target.value ) }
                        placeholder="Add a comment..."
                        className="w-full p-2 border rounded-lg mb-4"
                    />
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
                    >
                        Gửi
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ArticleDetail;
