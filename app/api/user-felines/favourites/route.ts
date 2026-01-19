import { NextRequest, NextResponse } from "next/server";


export async function GET() {
    /**
     * Get all favourites for the user
     */
    try {
        const response = await fetch(`https://api.thecatapi.com/v1/favourites`, {
            headers: {
                "x-api-key": process.env.CAT_API_KEY as string,
            },
        })
        const data = await response.json();
        
        if (!response.ok) {
            return NextResponse.json(
                { message: "Failed to fetch data" },
                { status: 500 }
            );
        }

        if (data.length === 0) {
            return NextResponse.json(
                { message: "You don't any favourites yet, try adding some favourites!" },
                {status: 200}
            )
        }
        
        return NextResponse.json(
            { message: "Your furry favourites", data },
            { status: 200 }
        );        
    } catch (error) {
        console.error("Error fetching favourites:", error);
        return NextResponse.json(
            { message: "Error fetching favourites" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    /**
     * Add a favourite for the user
     * @param image_id id of the image to add to favourites
     * @param sub_id id of the user to add the favourite for to keep track of who added it
     */
    try {
        const { image_id, sub_id } = await request.json();

        // if there's no image_id, return 400
        if (!image_id) {
            return NextResponse.json(
                { message: "No image_id provided." },
                { status: 400 }
            );
        }
        
        const response = await fetch(`https://api.thecatapi.com/v1/favourites`, {
            headers: {
                "x-api-key": process.env.CAT_API_KEY as string,
                "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({
                image_id,
                sub_id
            })
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(
                { message: "Oops something went wrong, try again later." },
                { status: 500 }
            );
        }
        return NextResponse.json(
            { message: "Favourite Added", data },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error adding favourite:", error);
        return NextResponse.json(
            { message: "Oops something went wrong, try again later." },
            { status: 500 }
        );
    }
}