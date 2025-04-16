import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongoose';
import Project from '@/models/Project';

export async function GET() {
    await dbConnect();
    const projects = await Project.find();
    return NextResponse.json(projects);
}
