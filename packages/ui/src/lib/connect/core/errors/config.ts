import type { Address } from "@/lib/connect/viem";

import type { Connector } from "../createConfig";
import { BaseError } from "./base";

export type ChainNotConfiguredErrorType = ChainNotConfiguredError & {
  name: "ChainNotConfiguredError";
};

export class ChainNotConfiguredError extends BaseError {
  override name = "ChainNotConfiguredError";

  constructor() {
    super("Chain not configured.");
  }
}

export type ConnectorAlreadyConnectedErrorType =
  ConnectorAlreadyConnectedError & {
    name: "ConnectorAlreadyConnectedError";
  };

export class ConnectorAlreadyConnectedError extends BaseError {
  override name = "ConnectorAlreadyConnectedError";

  constructor() {
    super("Connector already connected.");
  }
}

export type ConnectorNotConnectedErrorType = ConnectorNotConnectedError & {
  name: "ConnectorNotConnectedError";
};

export class ConnectorNotConnectedError extends BaseError {
  override name = "ConnectorNotConnectedError";

  constructor() {
    super("Connector not connected.");
  }
}

export type ConnectorNotFoundErrorType = ConnectorNotFoundError & {
  name: "ConnectorNotFoundError";
};

export class ConnectorNotFoundError extends BaseError {
  override name = "ConnectorNotFoundError";

  constructor() {
    super("Connector not found.");
  }
}

export type ConnectorAccountNotFoundErrorType =
  ConnectorAccountNotFoundError & {
    name: "ConnectorAccountNotFoundError";
  };

export class ConnectorAccountNotFoundError extends BaseError {
  override name = "ConnectorAccountNotFoundError";

  constructor({
    address,
    connector,
  }: {
    address: Address;
    connector: Connector;
  }) {
    super(`Account "${address}" not found for connector "${connector.name}".`);
  }
}

export type ConnectorChainMismatchErrorType = ConnectorAccountNotFoundError & {
  name: "ConnectorChainMismatchError";
};

export class ConnectorChainMismatchError extends BaseError {
  override name = "ConnectorChainMismatchError";

  constructor({
    connectionNetworkId,
    connectorNetworkId,
  }: {
    connectionNetworkId: string;
    connectorNetworkId: string;
  }) {
    super(
      `The current chain of the connector (id: ${connectorNetworkId}) does not match the connection's chain (id: ${connectionNetworkId}).`,
      {
        metaMessages: [
          `Current Chain ID:  ${connectorNetworkId}`,
          `Expected Chain ID: ${connectionNetworkId}`,
        ],
      }
    );
  }
}
