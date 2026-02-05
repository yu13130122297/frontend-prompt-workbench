import { NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

const CONFIG_DIR = path.join(process.cwd(), "config")
const CONFIG_FILE = path.join(CONFIG_DIR, "scenarios.json")

// 确保配置目录存在
async function ensureConfigDir() {
    try {
        await fs.access(CONFIG_DIR)
    } catch {
        await fs.mkdir(CONFIG_DIR, { recursive: true })
    }
}

// GET - 读取配置
export async function GET() {
    try {
        await ensureConfigDir()
        const data = await fs.readFile(CONFIG_FILE, "utf-8")
        return NextResponse.json(JSON.parse(data))
    } catch (error) {
        // 如果文件不存在，返回空配置
        return NextResponse.json({ scenarios: [], inputValues: {} })
    }
}

// POST - 保存配置
export async function POST(request: NextRequest) {
    try {
        await ensureConfigDir()
        const data = await request.json()
        await fs.writeFile(CONFIG_FILE, JSON.stringify(data, null, 2), "utf-8")
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("保存配置失败:", error)
        return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
    }
}
