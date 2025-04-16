import { Schema, Document, models, model } from 'mongoose';

export interface IProject extends Document {
    title: string;
    description: string;
    imageUrl: string;
    githubUrl: string;
    liveUrl?: string;
    techStack: string[];
    createdAt: Date;
}

const ProjectSchema = new Schema<IProject>(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        imageUrl: { type: String, required: true },
        githubUrl: { type: String, required: true },
        liveUrl: { type: String },
        techStack: [{ type: String }],
        createdAt: { type: Date, default: Date.now },
    },
    {
        timestamps: true,
    }
);

const Project = models.Project || model<IProject>('Project', ProjectSchema);

export default Project;
