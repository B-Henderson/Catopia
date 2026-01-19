import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    /**
     * Get user uploaded cats
     */
    try {
        const page = request.nextUrl.searchParams.get('page') || 0;

        // TODO reduce limit and add pagination?

        const response = await fetch(`https://api.thecatapi.com/v1/images?limit=100&page=${page}&size=small`, {
            headers: {
                "x-api-key": process.env.CAT_API_KEY as string,
            },
        });
        const data = await response.json();
        
        if (!response.ok) {
            return NextResponse.json(
                { message: "Failed to fetch data" },
                { status: 500 }
            );
        }
        
        return NextResponse.json(
            { message: "Data fetched successfully", data },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching data:", error);
        return NextResponse.json(
            { message: "Error fetching data" },
            { status: 500 }
        );
    }
}


export async function POST(request: NextRequest) {
    /**
     * Upload route, takes a form data object with file and sub_id
     * @file image file to upload
     * @sub_id id to identify uploader
     * 
     * Headers: 
     *   - x-api-key: API stored in the environment variables
     */
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File | null;
        
        // Check if the file is an image
        if (!file || !file.type.startsWith('image/')) {
            return NextResponse.json(
                { message: "File must be an image" },
                { status: 400 }
            );
        }
        
        const subId = (formData.get('sub_id') as string | null) || process.env.CAT_API_USER;
        
        const headers: Record<string, string> = {
            "x-api-key": process.env.CAT_API_KEY as string,
        };
        
        if (subId) {
            headers["sub_id"] = subId.toLowerCase();
        }
        
        const response = await fetch("https://api.thecatapi.com/v1/images/upload", {
            headers,
            method: "POST",
            body: formData,
        });
        const data = await response.json();
        
        if (!response.ok) {
            return NextResponse.json(
                { message: "Failed to upload image" },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { message: "Image uploaded successfully", data },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error uploading image:", error);
        return NextResponse.json(
            { message: "Error uploading image" },
            { status: 500 }
        );
    }
}
