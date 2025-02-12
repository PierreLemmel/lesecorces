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
            left,
            top,
            width,
            height
        })
        .toBuffer()

    return croppedBuffer;
}