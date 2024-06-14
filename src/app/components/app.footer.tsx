'use client'
import React from 'react'

const Footer = () =>
{
    return (
        <footer className="bg-white shadow mt-8">
            <div className="container mx-auto px-6 py-4">
                <div className="flex justify-between items-center">
                    <div className="text-gray-600">
                        © 2024 MyWebsite. Tất cả các quyền được bảo lưu.
                    </div>
                    <div className="flex space-x-4">
                        <a href="#" className="text-gray-600 hover:text-gray-800">Privacy Policy</a>
                        <a href="#" className="text-gray-600 hover:text-gray-800">Terms of Service</a>
                        <a href="#" className="text-gray-600 hover:text-gray-800">Contact</a>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer