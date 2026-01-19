import { NextResponse } from "next/server";
export const dynamic = "force-static";
export const revalidate = 3600;

// currently unused route, this is a route that provides random cat images
// from the cat api

export async function GET() {
    /**
     * Fetch route, fetches 10 random images from the cat api paginated
     * 
     * Headers: 
     *   - x-api-key: API stored in the environment variables
     */
    try {
        const response = await fetch("https://api.thecatapi.com/v1/images/search?limit=10&page=0&size=med", {
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
