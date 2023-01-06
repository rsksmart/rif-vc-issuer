import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers, providers, Signer, Wallet } from "ethers";
import RIFGatewayABI from './artifacts/IRIFGateway.json';

export interface IRifGateway {
    validateProvider(
        provider: string,
    ): Promise<any>
}

@Injectable()
export class RifGatewayContract {
    private contract: ethers.Contract;

    constructor(private configService: ConfigService) {
       this.contract = new ethers.Contract(
            this.configService.get<string>('rifGateway.contractAddress'),
            RIFGatewayABI.abi,
            new Wallet(
                this.configService.get<string>('rifGateway.deployer'),
                new providers.JsonRpcProvider()
            )  
        );
    }

    getInstance() {
        return this.contract;
    }
}
