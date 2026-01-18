import { NextRequest, NextResponse } from "next/server";


export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const {id} = await params;
        
        const response = await fetch(`https://api.thecatapi.com/v1/favourites/${id}`, {
            headers: {
                "x-api-key": process.env.CAT_API_KEY as string,
            },
            method: "DELETE",
        });
        
        if (!response.ok) {
            return NextResponse.json(
                { message: "Oops we couldn't find that favourite!" },
                { status: 500 }
            );
        }
        return NextResponse.json(
            { message: "Favourite Removed" },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { message: "Error deleting Favourite", error: error },
            { status: 500 }
        );
    }
}
