import { NextRequest, NextResponse } from "next/server";
import { addCroppedVersionToStorage, getCroppedPathForImage, getFileFromStorage } from "../../../lib/firebase-server";
import { EcorcesImage } from "../../../server/server";

type Params = {
	res: string;
	crop?: string;
}

export async function GET(req: NextRequest, { params }: { params: Params }) {
	
	try {
		const {
			searchParams
		} = req.nextUrl;

		const {
			res,
		} = params;

		if (!res || res.length === 0) {
			return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
		}

		const crop = searchParams.get("crop");
		const area = crop ? <EcorcesImage["cropArea"]> JSON.parse(decodeURIComponent(crop)) : undefined;

		const url = decodeURIComponent(params.res);
		let file;
		if (area) {
			const croppedPath = getCroppedPathForImage(url, area);
			file = await getFileFromStorage(croppedPath);

			const [exists] = await file.exists();

			if (!exists) {
				await addCroppedVersionToStorage(url, area);
				
				file = await getFileFromStorage(croppedPath);
			}

		}
		else {
			file = await getFileFromStorage(url);
		}

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
		return NextResponse.json({
			error: 'Internal server error'
		}, {
			status: 500 
		});
	}
}