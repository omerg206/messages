import { Request, Response, NextFunction } from 'express'

export function errorHandlerMiddleware(error: any, req: Request, res: Response, next: NextFunction) {
    console.error(error.toString())
    res.status(500).json({ error: error.toString() })
}
