import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET() {
    const posts = await prisma.post.findMany()
    return Response.json(posts)
}

export async function POST(request: Request) {
    const { title , content } = await request.json()

    const newPost = await prisma.post.create({
        data: {
            title,
            content
        }
    })

    return Response.json(newPost)
}