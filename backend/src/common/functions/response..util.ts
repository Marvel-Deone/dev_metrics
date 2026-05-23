import { HttpException, HttpStatus } from "@nestjs/common";

// Custom class that extends HttpException but with a marker property
export class PropagatedHttpException extends HttpException {
    public readonly shouldPropagate = true;

    constructor(response: string | object, status: number) {
        super(response, status);
    }
}

export const response = (status: 'success' | 'error' | string, title?: string, message?: string, code?: number, data?: any, meta?: any) => {
    return {
        statusCode: code,
        status,
        title,
        message,
        data,
        meta
    };
};

export const success = (data: any, title?: string, message?: string, code = HttpStatus.OK, meta?: any) => {
    return response('success', title, message, code, data, meta);
};

export const error = (title: string, message: string, code = HttpStatus.BAD_REQUEST, data = null) => {
    const res = response('error', title, message, code, data);
    // Use our custom exception class that should be recognized and propagated in catch blocks
    throw new PropagatedHttpException(res, code);
};