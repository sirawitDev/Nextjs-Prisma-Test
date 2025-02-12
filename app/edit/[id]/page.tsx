'use client'

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter, useParams } from 'next/navigation'
import { Input, Textarea, Select, Option } from "@material-tailwind/react"

const Edit = () => { //{ params }: { params: { id: string } }
    const { id } = useParams() as { id: string }
    //ผูก State  
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [categoryId, setCategoryId] = useState(null)
    const [categories, setCategories] = useState([])

    const router = useRouter()

    const fetchPosts = async (id: string) => {
        try {
            const response = await axios.get(`/api/posts/${id}`)

            setTitle(response.data.title)
            setContent(response.data.content)
            setCategoryId(response.data.categoryId)
        } catch (error) {
            console.log('error', error)
        }
    }

    const fetchCategory = async () => {
        try {
            const response = await axios.get(`/api/categories`)
            setCategories(response.data)
        } catch (error) {
            console.log('error', error)
        }
    }

    useEffect(() => {
        if (categories.length > 0 && !categoryId) {
            setCategoryId(categories[0].id)
        }
    }, [categories])


    useEffect(() => {
        if (id) {
            fetchPosts(id)
            fetchCategory()
        }
    }, [id])

    const handlerSubmit = async (event: React.FormEvent) => {
        event.preventDefault()
        try {
            await axios.put(`/api/posts/${id}`, {
                title,
                content,
                categoryId
            })
            router.push('/')
        } catch (error) {
            console.log('error', error)
        }
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-semibold mb-6">Edit Post {id}</h1>
            <form onSubmit={handlerSubmit} className="space-y-6">
                <div>
                    <Input
                        type="text"
                        name="title"
                        label="Title"
                        id="title"
                        value={title}
                        onChange={(e) => { setTitle(e.target.value) }}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>
                <div>
                    <Textarea
                        name="content"
                        id="content"
                        required
                        label="Content"
                        value={content}
                        onChange={(e) => { setContent(e.target.value) }}
                        rows={4}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    ></Textarea>
                </div>

                <div>
                    <select
                        value={categoryId || ''}
                        onChange={(e) => setCategoryId(e.target.value)}
                        className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 sm:text-sm bg-white"
                    >
                        {categories.map((cat: any) => (
                            <option key={cat.id} value={cat.id} className="text-gray-900">
                                {cat.name}
                            </option>
                        ))}
                    </select>


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