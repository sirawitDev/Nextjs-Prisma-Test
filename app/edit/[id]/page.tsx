'use client'

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter , useParams } from 'next/navigation'

const Edit = () => { //{ params }: { params: { id: string } }
    const { id } = useParams() as { id: string }
    //ผูก State  
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')

    const router = useRouter()

    const fetchPosts = async (id: string) => {
        try {
            const response = await axios.get(`/api/posts/${id}`)

            setTitle(response.data.title)
            setContent(response.data.content)
        } catch (error) {
            console.log('error' , error)
        }
    }

    useEffect(() => {
        if (id) {
            fetchPosts(id)
        }
    }, [id])

    const handlerSubmit = async (event: React.FormEvent) => {
        event.preventDefault()
        try {
            await axios.put(`/api/posts/${id}` , {
                title,
                content
            })
            router.push('/')
        } catch (error) {
            console.log('error' , error)
        }
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-semibold mb-6">Edit Post {id}</h1>
            <form onSubmit={handlerSubmit} className="space-y-6">
                <div>
                    <label
                        htmlFor="title"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Title
                    </label>
                    <input
                        type="text"
                        name="title"
                        id="title"
                        value={title}
                        onChange={(e) => { setTitle(e.target.value)}}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>
                <div>
                    <label
                        htmlFor="content"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Content
                    </label>
                    <textarea
                        name="content"
                        id="content"
                        required
                        value={content}
                        onChange={(e) => { setContent(e.target.value)}}
                        rows={4}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    ></textarea>
                </div>
                <div>
                    <button
                        type="submit"
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Update
                    </button>
                </div>
            </form>
        </div>
    )
}

export default Edit