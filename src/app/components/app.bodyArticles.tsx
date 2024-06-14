import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { FaHeart } from 'react-icons/fa';

const BodyArticle = () =>
{
    const [ token, setToken ] = useState<string | null>( null );
    const [ titles, setTitles ] = useState<any[]>( [] );
    const [ tanglist, settanglist ] = useState<any[]>( [] );
    const [ profile, setProfile ] = useState<any>( null );
    const profiles = profile?.following || [];
    const [ favorites, setFavorites ] = useState<string[]>( [] );
    console.log( profile );

    useEffect( () =>
    {
        if ( typeof window !== "undefined" )
        {
            const tokenFromStorage = localStorage.getItem( "token" );
            setToken( tokenFromStorage );
        }
    }, [] );

    useEffect( () =>
    {
        if ( profile?.favorites )
        {
            setFavorites( profile?.favorites );
        }
    }, [ profile ] );

    const fetchTitles = async () =>
    {
        try
        {
            const response = await fetch( "http://localhost:8080/api/articles/get" );
            if ( !response.ok )
            {
                throw new Error( "Failed to fetch data" );
            }
            const data = await response.json();
            setTitles( data?.getArticles );
        } catch ( error: any )
        {
            toast( error.message );
        }
    };

    const fetTanglist = async () =>
    {
        try
        {
            const tanglist = await fetch( "http://localhost:8080/api/articles/gettags" );
            if ( tanglist.ok )
            {
                const data = await tanglist.json();
                settanglist( data.tags );
            } else
            {
                const data = await tanglist.json();
                toast( data.message );
            }
        } catch ( error: any )
        {
            toast( error );
        }
    };

    const handleTagClick = async ( tag: string, author: string = "" ) =>
    {
        try
        {
            const response = await fetch( `http://localhost:8080/api/articles/locArticles?tag=${ tag }&author=${ author }` );
            if ( response.ok )
            {
                const data = await response.json();
                setTitles( data?.articles );
            } else
            {
                const data = await response.json();
                toast( data.message );
            }
        } catch ( error: any )
        {
            toast( error.message );
        }
    };

    const handleFavorits = async ( slug: any ) =>
    {
        const token = localStorage.getItem( "token" );
        try
        {
            const favorists = await fetch( `http://localhost:8080/api/articles/${ slug }/favorite`, {
                method: "POST",
                headers: {
                    Authorization: "Bearer " + token,
                    'Content-Type': 'application/json',
                },
            } );

            if ( favorists.ok )
            {
                toast( "Yêu thích bài viết thành công" );
                const data = await favorists.json();
                console.log( data?.slugs?._id );

                // Cập nhật trạng thái profile và titles
                setProfile( ( prevProfile: any ) => ( {
                    ...prevProfile,
                    favorites: [ ...prevProfile.favorites, data?.slugs?._id ]
                } ) );


                fetchTitles();

            } else
            {
                const data = await favorists.json();
                toast( data.message );
            }

        } catch ( error: any )
        {
            toast( error.message );
        }
    };

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
                setProfile( data.profiles );
            } else
            {
                const data = await response.json();
                toast( data.error );
            }

        } catch ( error: any )
        {
            toast( error );
        }
    };

    const handlefeed = async () =>
    {
        const token = localStorage.getItem( "token" );
        try
        {
            const feed = await fetch( "http://localhost:8080/api/articles/feed", {
                method: "GET",
                headers: {
                    Authorization: "Bearer " + token,
                    'Content-Type': 'application/json',
                }
            } );
            if ( feed.ok )
            {
                const data = await feed.json();
                toast( "Lấy thành công" );
                setTitles( data?.article );
            } else
            {
                const data = await feed.json();
                toast( data.message );
            }
        } catch ( error: any )
        {
            toast( error.message );
        }
    };

    useEffect( () =>
    {
        fetTanglist();
        fetchTitles();
        fetchProfile();

    }, [] );

    const isArticleFavorited = ( articleId: string ) =>
    {
        return favorites.includes( articleId );
    };

    return (
        <div className="container mx-auto p-6 flex flex-col md:flex-row gap-6">
            <div className="bg-white p-8 rounded-lg shadow-lg flex-1">
                <h2 className="text-2xl font-bold mb-6">Danh sách bài viết</h2>
                { titles?.length > 0 ? (
                    <div className="space-y-4">
                        { titles?.map( ( article, index ) => (
                            <div key={ index } className="bg-gray-50 p-6 rounded-lg shadow hover:shadow-lg transition duration-300 relative">
                                <h3 className="text-xl font-bold mb-2">{ article.title }</h3>
                                <p className="text-gray-700 mb-4">{ article.description }</p>
                                <div className="text-sm text-gray-500 mb-4">
                                    <span className="mr-4">Chuyên mục: { article.tagList.join( ", " ) }</span>
                                    <span>Ngày đăng: { new Date( article.createdAt ).toLocaleDateString() }</span>
                                </div>
                                <a href={ `/articleDetail/${ article.slug }` } className="text-blue-500 hover:underline">Đọc thêm</a>
                                <div className="absolute bottom-4 right-4">
                                    <button
                                        onClick={ () => handleFavorits( article.slug ) }
                                        className={ `flex items-center ${ isArticleFavorited( article._id ) && token ? 'text-red-500 hover:text-red-700' : 'text-gray-500 hover:text-gray-700' }` }
                                    >
                                        <FaHeart className="mr-2" /> { article.favoritesCount }
                                    </button>
                                </div>
                            </div>
                        ) ) }
                    </div>
                ) : (
                    <p>Không có dữ liệu</p>
                ) }
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg w-full md:w-1/4">
                <h2 className="text-2xl font-bold mb-6">Chuyên mục</h2>
                <ul className="space-y-2">
                    { tanglist?.map( ( tag, index ) => (
                        <li
                            key={ index }
                            className="text-gray-700 cursor-pointer hover:underline"
                            onClick={ () => handleTagClick( tag ) }
                        >
                            { tag }
                        </li>
                    ) ) }
                </ul>
                <h2 className="text-2xl font-bold mb-6">Các tác giả đã yêu thích</h2>
                <ul className="space-y-2">
                    { profiles?.map( ( author: any, index: any ) => (
                        <li
                            key={ index }
                            className="text-gray-700 cursor-pointer hover:underline"
                            onClick={ () => handleTagClick( "", author.username ) }
                        >
                            { author.username }
                        </li>
                    ) ) }
                </ul>
                <p className="text-2xl mt-3 font-bold mb-6">Các mục khác:</p>
                <ul className="space-y-2">
                    <li
                        className="text-gray-700 cursor-pointer hover:underline"
                        onClick={ () => handlefeed() }
                    >
                        Các bài viết của người dùng đã yêu thích
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default BodyArticle;
