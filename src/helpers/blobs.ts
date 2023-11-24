export const blobToB64Async = (blob: Blob | null,): Promise<string | null> => {
    return new Promise((resolve) => {
        if(!blob) return resolve(null);
        const reader = new FileReader();
        reader.onloadend = (event: ProgressEvent<FileReader>) => {
            if(event.target && typeof event.target.result === 'string') {
                resolve(event.target.result);
            }
            else {
                resolve(null);
            }
        }
        reader.readAsDataURL(blob);
    })
};
