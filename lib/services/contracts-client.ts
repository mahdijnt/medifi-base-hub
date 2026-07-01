import { withBasePath } from "@/lib/base-path";
import type {
  ContractDeploymentAnalyticsResult,
} from "@/lib/types/analytics";
import type { DeployedContractsResult } from "@/lib/types/contract";

type SerializedContract = {
  address: string;
  deployedAt: string;
  transactionHash?: string;
};

type ContractAnalyticsApiPayload = {
  total: number;
  contracts: SerializedContract[];
};

type ContractAnalyticsApiResponse = {
  success?: boolean;
  error?: string;
  data?: ContractAnalyticsApiPayload;
};

type DeployedContractApiRecord = {
  contractName: string;
  contractAddress: string;
  description: string;
  deploymentDate: string;
  basescanUrl: string;
};

type DeployedContractsApiResponse = {
  success?: boolean;
  error?: string;
  data?: DeployedContractApiRecord[];
};

const STATIC_EXPORT_HINT =
  "Contract analytics requires a server deployment (e.g. Vercel). Static export / GitHub Pages cannot run API routes.";

async function readJsonResponse<T>(response: Response): Promise<T | { error: string }> {
  if (response.status === 404) {
    return { error: STATIC_EXPORT_HINT };
  }

  if (!response.ok) {
    let detail = `Request failed (${response.status})`;
    try {
      const body = (await response.json()) as { error?: string };
      if (body.error) {
        detail = body.error;
      }
    } catch {
      // ignore parse errors
    }
    return { error: detail };
  }

  return (await response.json()) as T;
}

function parseAnalyticsResponse(
  body: ContractAnalyticsApiResponse,
): ContractDeploymentAnalyticsResult {
  if (body.success === false || body.error) {
    return { error: body.error ?? "Contract analytics unavailable" };
  }

  if (!body.data) {
    return { error: "Contract analytics unavailable" };
  }

  return {
    data: {
      total: body.data.total,
      contracts: body.data.contracts.map((contract) => ({
        address: contract.address,
        deployedAt: new Date(contract.deployedAt),
        ...(contract.transactionHash
          ? { transactionHash: contract.transactionHash }
          : {}),
      })),
    },
  };
}

/**
 * Client-side fetch for contract deployment analytics via `/api/basescan/contracts`.
 * Never calls Basescan directly — API key stays server-side.
 */
export async function fetchContractDeploymentAnalytics(
  address: string,
): Promise<ContractDeploymentAnalyticsResult> {
  const normalizedAddress = address.trim();

  if (!normalizedAddress) {
    return { error: "Wallet address is required." };
  }

  try {
    const response = await fetch(
      withBasePath(
        `/api/basescan/contracts?address=${encodeURIComponent(normalizedAddress)}`,
      ),
      { cache: "no-store" },
    );

    const body = await readJsonResponse<ContractAnalyticsApiResponse>(response);
    if ("error" in body && !("data" in body)) {
      return { error: body.error ?? "Contract analytics unavailable" };
    }

    return parseAnalyticsResponse(body as ContractAnalyticsApiResponse);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to fetch contract deployment analytics.";

    return { error: message };
  }
}

/**
 * Client-side fetch for the contract registry (enriched deployed contracts).
 */
export async function fetchDeployedContracts(
  walletAddress: string,
): Promise<DeployedContractsResult> {
  const normalizedAddress = walletAddress.trim();

  if (!normalizedAddress) {
    return { error: "Wallet address is required." };
  }

  try {
    const response = await fetch(
      withBasePath(
        `/api/contracts/${encodeURIComponent(normalizedAddress)}/registry`,
      ),
      { cache: "no-store" },
    );

    const body = await readJsonResponse<DeployedContractsApiResponse>(response);
    if ("error" in body && !("data" in body)) {
      return { error: body.error ?? "Contract analytics unavailable" };
    }

    const payload = body as DeployedContractsApiResponse;
    if (payload.success === false || payload.error) {
      return { error: payload.error ?? "Contract analytics unavailable" };
    }

    if (!payload.data) {
      return { error: "Contract analytics unavailable" };
    }

    return {
      data: payload.data.map((contract) => ({
        contractName: contract.contractName,
        contractAddress: contract.contractAddress,
        description: contract.description,
        deploymentDate: new Date(contract.deploymentDate),
        basescanUrl: contract.basescanUrl,
      })),
    };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to fetch deployed contracts.";

    return { error: message };
  }
}

/** @deprecated Use fetchContractDeploymentAnalytics — kept for gradual migration. */
export const getContractDeploymentAnalytics = fetchContractDeploymentAnalytics;

/** @deprecated Use fetchDeployedContracts — kept for gradual migration. */
export const getDeployedContracts = fetchDeployedContracts;
