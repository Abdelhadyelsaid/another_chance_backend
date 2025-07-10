import { Module } from "@nestjs/common";
import { SearchGateway } from "./search.gateway";

@Module({
    providers: [SearchGateway]
})
export class GatewayModule { }