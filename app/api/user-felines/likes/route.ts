import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    try {
        const response = await fetch("https://api.thecatapi.com/v1/votes", {
            headers: {
                "x-api-key": process.env.CAT_API_KEY as string,
            },
        });
        const data = await response.json();
        
        if (!response.ok) {
            return NextResponse.json(
                { message: "Failed to fetch votes" },
                { status: 500 }
            );
        }
        
        return NextResponse.json(
            { message: "Successfully found votes", data },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching Votes:", error);
        return NextResponse.json(
            { message: "Error fetching data" },
            { status: 500 }
        );
    }
}

export async function POST(
    request: NextRequest
) {
    try {
        const { vote_id, value, image_id, sub_id } = await request.json();

        if (value === undefined || value === null) {
            return NextResponse.json(
                { message: "You must provide a value" },
                { status: 400 }
            );
        }

        // If vote_id exists, delete the existing vote first
        if (vote_id) {
            const deleteResponse = await fetch(`https://api.thecatapi.com/v1/votes/${vote_id}`, {
                headers: {
                    "x-api-key": process.env.CAT_API_KEY as string,
                },
                method: "DELETE",
            });

            if (!deleteResponse.ok) {
                return NextResponse.json(
                    { message: "Failed to delete existing vote" },
                    { status: 500 }
                );
            }
        }
        // if the value is 0 we're just removing a vote which we do by default of there being a vote_id 
        // so return 200
        if (value === 0) {
            return NextResponse.json(
                { message: "Vote removed successfully" },
                { status: 200 }
            );
        }
        // if value is 1 or -1 we're adding a new vote
        if (value === 1 || value === -1) {
            if (!image_id) {
                return NextResponse.json(
                    { message: "image_id is required when creating a vote" },
                    { status: 400 }
                );
            }

            const postResponse = await fetch("https://api.thecatapi.com/v1/votes", {
                headers: {
                    "x-api-key": process.env.CAT_API_KEY as string,
                    "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify({
                    image_id,
                    value,
                    sub_id: sub_id || process.env.CAT_API_USER
                })
            });

            const voteData = await postResponse.json();

            if (!postResponse.ok) {
                console.error("Failed to create vote:", voteData);
                return NextResponse.json(
                    { message: "Something went wrong, try again later." },
                    { status: 500 }
                );
            }

            return NextResponse.json(
                { message: value === 1 ? "Like added successfully" : "Dislike added successfully", data: voteData },
                { status: 200 }
            );
        }

        return NextResponse.json(
            { message: "Invalid value. Must be 1 (like), -1 (dislike), or 0 (remove)" },
            { status: 400 }
        );
    } catch (error) {
        console.error("Error handling vote:", error);
        return NextResponse.json(
            { message: "Error processing vote" },
            { status: 500 }
        );
    }
}