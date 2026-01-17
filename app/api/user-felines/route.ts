import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    /**
     * Get user uploaded cats
     */
    try {
        const response = await fetch("https://api.thecatapi.com/v1/images?limit=10&page=0&size=med", {
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
        const response = await fetch("https://api.thecatapi.com/v1/images/upload", {
            headers: {
                "x-api-key": process.env.CAT_API_KEY as string,
                "sub_id": process.env.CAT_API_USER as string
            },
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
        console.log("error", error);
        return NextResponse.json(
            { message: "Error uploading image", error: error },
            { status: 500 }
        );
    }
}