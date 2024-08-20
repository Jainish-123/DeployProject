export default interface AxiosError {
    response?: {
        data?: {
            message?: string;
        };
        status?: number;
    };
}