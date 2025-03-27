"use client";

import React, { useState } from "react";
import { IKUpload } from "imagekitio-next";
import { Loader2 } from "lucide-react";
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props";

interface FileUploadProps {
    onSuccess: (res: IKUploadResponse) => void;
    onProgress?: (progress: number) => void;
    fileType?: "image" | "video";
}

export default function FileUpload({
    onSuccess,
    onProgress,
    fileType = "image",
}: FileUploadProps) {
    
    const [uploading, setUploading] = useState(false);
    const [errors, setError] = useState<string | null>(null);

    const onError = (err: { message: string }) => {
        console.log("Error", err);
        setError(err.message);
        setUploading(false);
    };

    const handleSuccess = (response: IKUploadResponse) => {
        console.log("Success", response);
        setUploading(false);
        setError(null);
        onSuccess(response);
    };

    const handleProgress = (evt: ProgressEvent) => {
        if(evt.lengthComputable && onProgress){
            const percentComplete = (evt.loaded / evt.total) * 100;
            onProgress(Math.round(percentComplete));
        }
    };

    const handleStartUpload = (evt: React.ChangeEvent<HTMLInputElement>) => {
        console.log("Start", evt);
    };

    const validateFile = (file: File) => {
        if(fileType === "video"){
            if(!file.type.startsWith("video/")){
                setError("Please upload a video file!")
                return false
            }

            if(file.size > 100 * 1024 * 1024){
                setError("File size should be less than 100MB")
                return false
            }
        } else{
            const validTypes = ["image/jpeg", "image/png", "image/webp"];
            if(!validTypes.includes(file.type)){
                setError("Please upload an image file (jpeg, png, webp)!")
                return false
            }

            if(file.size > 5 * 1024 * 1024){
                setError("File size should be less than 5MB")
                return false
            }
        }

        return false
    }


    return (
        <div className="space-y-2">
            <IKUpload
                className="file-input file-input-bordered w-full"
                fileName={fileType === "video" ? "sample-video" : "sample-image"}
                folder={fileType === "video" ? "/videos" : "/images"}
                useUniqueFileName={true}
                accept={fileType === "video" ? "video/*" : "image/*"}
                validateFile={validateFile}
                onError={onError}
                onSuccess={handleSuccess}
                onUploadProgress={handleProgress}
                onUploadStart={handleStartUpload}
            />

            {
                uploading && (
                    <div className="flex items-center gap-2 text-sm text-primary">
                        <Loader2 className="animate-spin w-4 h-4" />
                        <span>Uploading...</span>
                    </div>
                )
            }
            {
                errors && (
                    <div className="text-error text-sm">{errors}</div>
                )
            }
        </div>
    );
}