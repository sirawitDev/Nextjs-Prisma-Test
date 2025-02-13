'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'
import { Input, Textarea, Select, Option } from "@material-tailwind/react"


const Create = () => {
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [categoryId, setCategoryId] = useState(null)
    const [categories, setCategories] = useState([])

    const router = useRouter()

    useEffect(() => {
        fetchCategory()
    }, [])

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

    const handlerSubmit = async (event: React.FormEvent) => {
        event.preventDefault()

        const result = await Swal.fire({
            title: 'ยืนยันการส่งโพสต์?',
            text: 'คุณต้องการส่งโพสต์นี้หรือไม่?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'ใช่, ส่งเลย',
            cancelButtonText: 'ไม่, ยกเลิก',
        })

        if (result.isConfirmed) {
            const swalLoading = Swal.fire({
                title: 'กำลังส่ง...',
                text: 'กรุณารอสักครู่',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading()
                }
            })

            try {
                await axios.post('/api/posts', {
                    title,
                    content,
                    categoryId
                })

                await swalLoading.close()

                await Swal.fire({
                    title: 'สำเร็จ!',
                    text: 'โพสต์ของคุณถูกสร้างเรียบร้อยแล้ว',
                    icon: 'success',
                    confirmButtonText: 'ตกลง'
                })

                router.push('/')
            } catch (error) {
                await swalLoading.close()

                console.log('error', error)
                await Swal.fire({
                    title: 'เกิดข้อผิดพลาด!',
                    text: 'มีบางอย่างผิดพลาด กรุณาลองใหม่อีกครั้ง',
                    icon: 'error',
                    confirmButtonText: 'ตกลง'
                })
            }
        }
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-semibold mb-6">สร้างโพสต์ใหม่</h1>
            <form onSubmit={handlerSubmit} className="space-y-6">
                <div>
                    <Input
                        type="text"
                        name="title"
                        id="title"
                        value={title}
                        label="หัวข้อ"
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="mt-1 block w-full"
                    />
                </div>
                <div>
                    <Textarea
                        name="content"
                        label="เนื้อหา"
                        id="content"
                        required
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={4}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>

                <div>
                    <Select
                        label="เลือกหมวดหมู่"
                        value={categoryId || ''}
                        onChange={(value) => setCategoryId(value)}
                    >
                        {categories.map((cat: any) => (
                            <Option key={cat.id} value={cat.id}>
                                {cat.name}
                            </Option>
                        ))}
                    </Select>
                </div>

                <div>
                    <button
                        type="submit"
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        ส่ง
                    </button>
                </div>
            </form>
        </div>
    )
}

export default Create
