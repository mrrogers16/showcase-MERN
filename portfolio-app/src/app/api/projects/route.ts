import { NextResponse } from "next/server";
import Project from "@/app/models/Project";  // ← models folder
import { dbConnect } from "@/app/lib/mongoose";    // ← lib folder

// GET /api/projects
export async function GET() {
    await dbConnect();                                 // reuse cached conn

    const projects = await Project
        .find()
        .sort({ createdAt: -1 })
        .lean();

    return NextResponse.json(projects);
}
