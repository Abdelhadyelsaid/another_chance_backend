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
                request.user = {
                  id: payload.id,
                  user_type_id: payload.user_type_id,
                  user_type: payload.user_type // include if present in payload
                };

            } catch (exception: any) {
                console.error(`Unauthorized Request on ${request.baseUrl}. \nMessage: ${exception.message}`);
            }
        }

        next();
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const authHeader = request.headers.authorization;
        if (!authHeader) return undefined;
        // Standard: "Bearer <token>"
        const [type, token] = authHeader.split(' ');
        if (type === 'Bearer' && token) return token;
        return undefined;
    }

}