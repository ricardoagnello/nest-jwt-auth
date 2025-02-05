import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { InvalidTokenService } from "src/invalid-token/invalid-token.service";

@Injectable()
export class VerifyInvalidTokenMiddleware implements NestMiddleware {
    constructor(private invalidTokenService: InvalidTokenService) {}

    async use(req: Request, res: Response, next: NextFunction) {
        const token = req.headers.authorization?.split(' ')[1];
        if (token && await this.invalidTokenService.isInvalidToken(token)) {
            return res.status(401).json({ message: 'Invalid Token'});
        }
        next();
        
    }
}
