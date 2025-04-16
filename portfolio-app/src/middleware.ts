// middleware.ts
import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

// Tell Next which routes to apply the middleware to
export const config = {
    matcher: [
        "/((?!.*\\..*|_next).*)", // everything except static files
        "/",                      // homepage
        "/(api|trpc)(.*)"         // APIs
    ],
};
