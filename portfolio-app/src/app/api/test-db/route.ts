import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongoose';
import Project from '@/models/Project';

export async function GET() 
{
    try 
    {
        await dbConnect();

        // Optional: fetch all projects just to test query
        const projects = await Project.find();

        return NextResponse.json({
            status: 'success',
            count: projects.length,
            projects,
        });
    } 
    catch (error) 
    {
        console.error('[MongoDB Error]', error);
        return NextResponse.json({ status: 'fail', error: (error as Error).message }, { status: 500 });
    }
}
