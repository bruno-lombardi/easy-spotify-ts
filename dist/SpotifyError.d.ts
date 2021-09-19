export declare class SpotifyError extends Error {
    status: number;
    constructor(error: {
        message?: string;
        status?: number;
    });
}
