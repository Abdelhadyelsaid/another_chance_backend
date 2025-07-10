import { Injectable, NestMiddleware } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { NextFunction, Request, Response } from "express";

@Injectable()
export class AuthorizationMiddleware implements NestMiddleware {

    constructor(private readonly jwtService: JwtService) { }

    async use(request: Request, response: Response, next: NextFunction) {

        const token = this.extractTokenFromHeader(request);

        if (token) {

            try {
                const payload = await this.jwtService.verifyAsync(
                    token,
                    {
                        secret: process.env.JWT_TOKEN
                    }
                );

                //@ts-ignore
                request.user_id = payload.id;
                //@ts-ignore
                request.user_type_id = payload.user_type_id;

            } catch (exception: any) { console.error(`Unauthorized Request on ${request.baseUrl}. \nMessage: ${exception.message}`) }
        }

        next()
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const token = request.headers.authorization?.split(', ')[0] ?? ''
        return token ? token : undefined;
    }

}