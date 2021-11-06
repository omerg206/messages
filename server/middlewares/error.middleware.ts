import { Request, Response, NextFunction } from 'express'

export function errorHandlerMiddleware(error: any, req: Request, res: Response, next: NextFunction) {
    res.status(500).json({ error: error.toString() })
}
