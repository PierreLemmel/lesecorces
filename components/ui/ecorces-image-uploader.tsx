"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import Cropper, { Area, Point } from "react-easy-crop";
import { mergeClasses, timeStampString } from "../../lib/utils";
import { baseUiInputClasses, getButtonClasses, getImageData } from "./ecorces-ui";
import EcorcesButton from "./ecorces-button";
import LoadingSpinner from "./loading-spinner";
import { pathCombine } from "../../lib/files";
import { storeFile } from "../../lib/firebase";
import { EcorcesImage } from "../../server/server";


export type EcorcesImageUploaderProps = {
	onUpload: (file: EcorcesImage|undefined) => void;
	file?: EcorcesImage;
	acceptedFormats?: string[];
	className?: string;
	disabled?: boolean;
    imageSize?: {
        width: number;
        height: number;
    },
	hasCropping?: boolean;
	destinationFolder: string;
};

const EcorcesImageUploader = (props: EcorcesImageUploaderProps) => {
	const {
		onUpload,
		acceptedFormats = ["image/png", "image/jpeg", "image/webp"],
		disabled = false,
		className,
        imageSize = { width: 800, height: 300 },
		file,
		hasCropping = true,
		destinationFolder
	} = props;

	const fileRef = useRef<File | null>(null);

	const [loading, setLoading] = useState(false);
	const [croppedPreview, setCroppedPreview] = useState<string | null>(null);
	const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
	const [zoom, setZoom] = useState(1);
	const [cropArea, setCropArea] = useState<Area>({ ...crop, ...imageSize });
	const [imageSrc, setImageSrc] = useState<string | null>(null);
	const [isCropping, setIsCropping] = useState(false);

	useEffect(() => {
		if (file) {
			setCropArea(file.cropArea);
			setImageSrc(file.url);
			
			if (hasCropping) {
				setLoading(true);
				getImageData(file.url, file.cropArea, (result) => {
					setCroppedPreview(result);
					setLoading(false);
				});
			}
			else {
				setCroppedPreview(file.url);
			}
		}
		else {
			setCroppedPreview(null);
			setCropArea({ ...crop, ...imageSize });
			setImageSrc(null);
		}

	}, [file]);

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0] || null;
		

		if (file && !acceptedFormats.includes(file.type)) {
			alert("Invalid file type. Please upload an image.");
			return;
		}

		if (file) {
			fileRef.current = file;

			const reader = new FileReader();
			reader.onload = () => setImageSrc(reader.result as string);
			reader.readAsDataURL(file);
		} else {
			setImageSrc(null);
		}

		if (hasCropping) {
			setIsCropping(true);
		}
		else {
			sendFile(file!);
		}
	};

	const onCropComplete = useCallback((relCroppedArea: Area, pixelsCroppedArea: Area) => {
		setCropArea(pixelsCroppedArea);
	}, []);


	const sendFile = async (file: File) => {
		setLoading(true);

		const type = file.type.split("/")[1];
		const timestamp = timeStampString();
		const path = pathCombine(destinationFolder, `${timestamp}.${type}`);

		await storeFile(file, path);
		onUpload({
			url: "/" + pathCombine("res", encodeURIComponent(path)),
			cropArea
		});

		fileRef.current = null;
		setLoading(false);
	}

	const setPreview = (src: string) => {
		setLoading(true);
		getImageData(src, cropArea, (result) => {
			setCroppedPreview(result);
			setLoading(false);
		});
	}

	const cropImage = async () => {
		if (!imageSrc) return;

		setIsCropping(false);

		if (fileRef.current) {
			sendFile(fileRef.current);
		}
		else {
			setPreview(imageSrc);
		}
	};

	const onCropPreviewEdit = () => {
		setIsCropping(true);
	}

	const onCropPreviewRemove = () => {

		setCrop({ x: 0, y: 0 });
		setZoom(1);

		setImageSrc(null);
		onUpload(undefined);
		setCroppedPreview(null);
	}

	if (loading) {
		return <div className={mergeClasses(
			baseUiInputClasses,
			"flex flex-col items-center h-48",
			className
		)}>
			<LoadingSpinner />
		</div>
	}

	if (imageSrc && isCropping) {

		return <div className={mergeClasses(
			baseUiInputClasses,
			"flex flex-col items-center",
			className
		)}>
			<div className="w-full flex flex-col items-center justify-center gap-3 p-2" >
				<div className="relative w-full h-64">
					<Cropper
						image={imageSrc}
						crop={crop}
						zoom={zoom}
						aspect={imageSize.width / imageSize.height}
						onCropChange={setCrop}
						onZoomChange={setZoom}
						onCropComplete={onCropComplete}
						zoomWithScroll={true}
						showGrid={true}
					/>
				</div>
				<EcorcesButton
					onClick={cropImage}
				>
					Recadrer
				</EcorcesButton>
			</div>
		</div>
	}

	if (imageSrc) {

		return <div className={mergeClasses(
			baseUiInputClasses,
			"flex flex-col items-center",
			className
		)}>
			<div className="w-full flex flex-col items-center gap-3 p-2" >
				<img
					className="max-w-[75%] rounded-md"
					src={croppedPreview ?? ""}
					alt="Cropped Image"
				/>
				<div className="flex flex-row gap-2">
					{hasCropping && <EcorcesButton onClick={onCropPreviewEdit}>
						Modifier
					</EcorcesButton>}
					<EcorcesButton onClick={onCropPreviewRemove}>
						Retirer
					</EcorcesButton>
				</div>
			</div>
		</div>
	}


	return <div className={mergeClasses(
		baseUiInputClasses,
		"flex flex-col items-center",
		className
	)}>
		<label className={mergeClasses(
			"py-5"
		)}>
			<input type="file" accept={acceptedFormats.join(",")} onChange={handleFileChange} disabled={disabled} className="hidden" />
			<div className={mergeClasses(
				getButtonClasses("Normal"),
				disabled && "opacity-50 cursor-not-allowed",
			)}>
				Télécharger une image
			</div>
		</label>
	</div>
};

export default EcorcesImageUploader;