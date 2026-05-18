import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  BASE_FEE,
  Contract,
  Keypair,
  Networks,
  TransactionBuilder,
  xdr,
  scValToNative,
  SorobanRpc,
} from '@stellar/stellar-sdk';

@Injectable()
export class StellarService implements OnModuleInit {
  private rpc: SorobanRpc.Server;
  private contractId: string;
  private networkPassphrase: string;

  constructor(private configService: ConfigService) {
    const stellarConfig = this.configService.get('app.stellar')!;
    this.contractId = stellarConfig.contractId;
    this.networkPassphrase = stellarConfig.networkPassphrase;
    this.rpc = new SorobanRpc.Server(stellarConfig.rpcUrl);
  }

  async onModuleInit() {
    console.log(`StellarService initialised — contract: ${this.contractId}`);
  }

  async getContractData(key: string): Promise<any> {
    const scKey = xdr.ScVal.scvSymbol(key);
    const ledgerEntry = await this.rpc.getContractData(this.contractId, scKey);
    const scVal = ledgerEntry.val.contractData().val();
    return scValToNative(scVal);
  }

  async simulateTransaction(functionName: string, ...args: any[]): Promise<any> {
    return this.simulateTransactionWithSecret(
      process.env.ADMIN_SECRET ?? '',
      functionName,
      ...args,
    );
  }

  async simulateTransactionWithSecret(
    sourceSecret: string,
    functionName: string,
    ...args: any[]
  ): Promise<any> {
    const contract = new Contract(this.contractId);
    const sourceKeypair = Keypair.fromSecret(sourceSecret);
    const sourceAccount = await this.rpc.getAccount(sourceKeypair.publicKey());

    const tx = new TransactionBuilder(sourceAccount, { fee: BASE_FEE })
      .setNetworkPassphrase(this.networkPassphrase)
      .setTimeout(30)
      .addOperation(contract.call(functionName, ...args))
      .build();

    const sim = await this.rpc.simulateTransaction(tx);

    if ((sim as any).error) {
      throw new Error(`Simulation error: ${(sim as any).error}`);
    }

    if ((sim as any).result) {
      return scValToNative((sim as any).result.retval);
    }

    return null;
  }

  async submitTransaction(
    functionName: string,
    sourceSecret: string,
    ...args: any[]
  ): Promise<string> {
    const contract = new Contract(this.contractId);
    const sourceKeypair = Keypair.fromSecret(sourceSecret);
    const sourceAccount = await this.rpc.getAccount(sourceKeypair.publicKey());

    const tx = new TransactionBuilder(sourceAccount, { fee: BASE_FEE })
      .setNetworkPassphrase(this.networkPassphrase)
      .setTimeout(30)
      .addOperation(contract.call(functionName, ...args))
      .build();

    const preparedTx = await this.rpc.prepareTransaction(tx);
    preparedTx.sign(sourceKeypair);
    const response = await this.rpc.sendTransaction(preparedTx);
    return response.hash;
  }
}
