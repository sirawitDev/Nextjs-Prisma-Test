'use client'

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'
import { TextField, Button } from '@mui/material'

const List = () => {
    const [posts, setPosts] = useState([])
    const [search, setSearch] = useState('')
    const [category, setCategory] = useState('')
    const [categories, setCategories] = useState([])
    const [sort, setSort] = useState('desc')

    useEffect(() => {
        fetchPosts()
        fetchCategory()
    }, [])

    const fetchPosts = async () => {
        try {
            const query = new URLSearchParams({ category, search, sort }).toString()
            const res = await axios.get(`/api/posts?${query}`)
            setPosts(res.data)
        } catch (error) {
            console.error(error)
        }
    }

    const fetchCategory = async () => {
        try {
            const res = await axios.get(`/api/categories`)
            setCategories(res.data)
        } catch (error) {
            console.error(error)
        }
    }

    const handleApplyFilters = () => {
        fetchPosts()
    }

    const deletePost = async (id: Number) => {
        try {
            await axios.delete(`/api/posts/${id}`)
            fetchPosts()
        } catch (error) {
            console.error('Failed to delete the post', error)
        }
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <div className='flex justify-between'>
                <h1 className="text-2xl font-semibold mb-6">Blog Posts <span className=' text-green-500 font-bold'>CRUD</span> Test</h1>

                <div>
                    <Link
                        href="/profile"
                        className=" bg-blue-500 text-white rounded px-4 py-2"
                    >
                        Profile
                    </Link>
                </div>
            </div>

            <div className='flex justify-center'>
                <div className="flex justify-between items-center mb-6">
                    <div className="flex gap-4">
                        <TextField
                            label="Search by title"
                            variant="outlined"
                            size="small"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />

                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="">Select Category</option>
                            {categories.map((cat: any) => (
                                <option value={cat.name} key={cat.id || cat.name}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>

                        <select
                            value={sort}
                            onChange={(e) => setSort(e.target.value)}
                            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="desc">Latest</option>
                            <option value="asc">Oldest</option>
                        </select>

                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleApplyFilters}
                        >
                            Apply
                        </Button>
                    </div>
                </div>
            </div>


            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                Title
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                Category
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {posts.map((post: any, index) => (
                            <tr key={post.id || post._id || index}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">
                                        {post.title}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">
                                        <p className=' text-center'>{post.category.name}</p>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className=' flex justify-center'>
                                        <Link href={`/edit/${post.id}`} passHref>
                                            <Button
                                                variant="text"
                                                color="primary"
                                                className="mr-4"
                                            >
                                                Edit
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="text"
                                            color="error"
                                            onClick={() => deletePost(post.id)}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Link
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                href="/create"
            >
                Create a New Post
            </Link>
        </div>
    )
}

export default List
