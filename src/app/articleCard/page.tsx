'use client';

import React, { useState } from "react";
import { toast } from "sonner";

const PostArticleForm = () =>
{
    const [ title, setTitle ] = useState( "" )
    const [ body, setBody ] = useState( "" )
    const [ description, setDescrition ] = useState( "" )
    const [ tagList, setTangList ] = useState( "" )

    const handleAddPost = async ( e: React.FormEvent<HTMLFormElement> ) =>
    {
        e.preventDefault();
        const token = localStorage.getItem( "token" )
        const tagsArray = tagList.split( "," ).map( tag => tag.trim() ).filter( tag => tag !== "" );

        const post = { title, body, description, tagList: tagsArray };
        try
        {
            const addPost = await fetch( `http://localhost:8080/api/articles/creat`, {
                method: "POST",
                headers: {
                    Authorization: "Bearer " + token,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify( post )
            } )
            if ( addPost.ok )
            {
                const data = await addPost.json()
                console.log( data );
                window.location.href = "/"
                toast( "thêm bài viết thành công " );

            } else
            {
                const data = await addPost.json()

                toast( data.message )
            }
        } catch ( error: any )
        {
            toast( error )
        }
    }
    return (
        <div className="container mx-auto p-6">
            <div className="bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-6">Đăng bài viết mới</h2>
                <form action="/api/post" onSubmit={ handleAddPost } method="POST">
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">Tiêu đề</label>
                        <input
                            value={ title } onChange={ ( e ) => setTitle( e.target.value ) } className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="title" type="text" placeholder="Nhập tiêu đề" required />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="content">Nội dung</label>
                        <textarea value={ body } onChange={ ( e ) => setBody( e.target.value ) } className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="content" placeholder="Nhập nội dung bài viết" required></textarea>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="content">Chi tiết</label>
                        <textarea value={ description } onChange={ ( e ) => setDescrition( e.target.value ) } className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="content" placeholder="Nhập nội dung bài viết" required></textarea>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="tags">Thẻ</label>
                        <input value={ tagList } onChange={ ( e ) => setTangList( e.target.value ) } className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="tags" type="text" placeholder="Nhập các thẻ (phân cách bởi dấu phẩy)" />
                    </div>
                    <div className="flex items-center justify-between">
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                            Đăng bài viết
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PostArticleForm;