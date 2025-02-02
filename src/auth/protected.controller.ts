import { Controller, Get, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";

@Controller('protected')
export class ProtectedController {
    
    @Get()
    @UseGuards(JwtAuthGuard)
    getProtectedResource() {
        return 'This is a protected resource';
    }
}