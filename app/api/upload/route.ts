import { type NextRequest, NextResponse } from "next/server"
import { writeFile } from "fs/promises"
import path from "path"

export async function POST(request: NextRequest) {
  const data = await request.formData()
  const file: File | null = data.get("file") as unknown as File

  if (!file) {
    return NextResponse.json({ success: false, message: "No file uploaded" }, { status: 400 })
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  // With the file data in the buffer, you can do whatever you want with it.
  // For this example, we'll just write it to the filesystem in a new location
  const uploadDir = path.join(process.cwd(), "public/uploads")
  const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
  const filename = file.name.replace(/\.[^/.]+$/, "") + "-" + uniqueSuffix + path.extname(file.name)
  const filepath = path.join(uploadDir, filename)

  try {
    await writeFile(filepath, buffer)
    return NextResponse.json({ success: true, filename: filename })
  } catch (error) {
    console.error("Error writing file:", error)
    return NextResponse.json({ success: false, message: "Error writing file" }, { status: 500 })
  }
}

