import { NextRequest, NextResponse } from "next/server";


export async function GET() {
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
    try {
        const { image_id, sub_id } = await request.json();

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