// Last middleware in the stack (mounted after all routes). Every thrown
// AppError — from authenticate, authorize, ownership, or a controller —
// lands here via asyncHandler's `.catch(next)`.
export const errorHandler = (err, req, res, next) => { // eslint-disable-line no-unused-vars
    const statusCode = err.statusCode ?? 500;
    const isOperational = err.isOperational ?? false;

    // Anything NOT thrown as an AppError is a real bug — log the stack, and
    // never leak its raw message to the client.
    if (!isOperational) {
        console.error('UNEXPECTED ERROR:', err);
    }

    res.status(statusCode).json({
        success: false,
        message: isOperational ? err.message : `Something went wrong. Please try again later.${err}`,
        code: err.code ?? 'INTERNAL_ERROR',
    });
}

export const notFoundHandler = (req, res) => {
    res.status(404).json({
        success: false,
        message: `No route matches ${req.method} ${req.originalUrl}.`,
        code: 'ROUTE_NOT_FOUND',
    });
}
