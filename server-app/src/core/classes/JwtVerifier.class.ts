import { JwtService } from "@nestjs/jwt";

export class JwtVerifier {
    public async verify(jwtService: JwtService, token: string): Promise<any> {
        let jwtPayload = null;
  
        try {
          jwtPayload = await jwtService.verifyAsync(token);
          
          return Promise.resolve(jwtPayload);
        } catch(err) {
          console.log(err);
  
          return Promise.reject(null);
        }
    }
}