import { Injectable} from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy} from "passport-jwt";
import { token } from "../constants/jwt.const";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            passReqToCallback: true,
            secretOrKey: token.secretKey
        })
    }

    async validate(req:any, jwtPayload: any) {
        return {login: jwtPayload.login, id: jwtPayload.id, role: jwtPayload.role};
    }
}