export type DeployedContractRecord = {
  contractName: string;
  contractAddress: string;
  description: string;
  deploymentDate: Date;
  basescanUrl: string;
};

export type DeployedContractsResult =
  | { data: DeployedContractRecord[] }
  | { error: string };

export type NormalizedContract = {
  contractName: string;
  contractAddress: string;
  description: string;
  deploymentDate: string;
  basescanUrl: string;
  deployerWallet: string;
};

export type ContractSyncPayload = {
  contracts: NormalizedContract[];
  generatedAt: string;
  version: number;
};
