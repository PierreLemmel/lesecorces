import sharp from "sharp";
import { EcorcesCropArea } from "./server";

export async function cropImage(buffer: Buffer, cropArea: EcorcesCropArea) {

    const {
        x: left,
        y: top,
        width,
        height
    } = cropArea;

    const s = sharp(buffer);

    const croppedBuffer = await s.extract({
            left: Math.round(left),
            top: Math.round(top),
            width: Math.round(width),
            height: Math.round(height)
        })
        .toBuffer()

    return croppedBuffer;
}