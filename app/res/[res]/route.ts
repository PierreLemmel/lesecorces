import { NextRequest, NextResponse } from "next/server";
import { getFileFromStorage } from "../../../lib/firebase-server";

export async function GET(req: NextRequest, { params }: { params: { res: string } }) {
	
	try {
		const {
			res
		} = params;

		if (!res || res.length === 0) {
			return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
		}

		const url = decodeURIComponent(params.res);

		const file = await getFileFromStorage(url);

		const [exists] = await file.exists();

		if (!exists) {
			return NextResponse.json(
				{ error: `Can't find resource '${res}'` },
				{ status: 404 }
			);
		}

		const [buffer] = await file.download();
		const metadata = await file.getMetadata();
		const contentType = metadata[0].contentType || "application/octet-stream";

		
		return new NextResponse(buffer, {
			headers: {
				"Content-Type": contentType,
				"Cache-Control": "public, max-age=31536000, immutable",
			},
		});

	} catch (error) {
		console.error('Error fetching image:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}