import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
    request: NextRequest,
  { params }: { params: { id: string } }
) {
    /**
     * deletes an image from the cat api
     * @params
     *    - id: id of image to delete
     * Headers: 
     *   - x-api-key: API stored in the environment variables
    */

    try {
        const {id} = await params;
        
        const response = await fetch(`https://api.thecatapi.com/v1/images/${id}`, {
            headers: {
                "x-api-key": process.env.CAT_API_KEY as string,
            },
            method: "DELETE",
        });

        if (!response.ok) {
            return NextResponse.json(
                { message: "Oops we couldn't find that image!" },
                { status: 500 }
            );
        }
        return NextResponse.json(
            { message: "Image deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { message: "Error deleting image", error: error },
            { status: 500 }
        );
    }
}

export async function GET(
    request: NextRequest,
    {params} : {params: {id: string}}
) {

    try {
        // get images uploaded by sub_id
        const { id } = await params;
    
        const response = await fetch(`https://api.thecatapi.com/v1/images?sub_id=${id}`, {
            headers: { 
                "x-api-key": process.env.CAT_API_KEY as string,
            }
        });
        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(
                { message: "No images found associated with user" },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { message: "Felines found", cats: data},
            { status: 200 }
        )
        
    } catch (error) {
        return NextResponse.json(
            { message: "Error retriving user images", error: error },
            {status: 500}
        )
    }



}
