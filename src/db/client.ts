import { DynamoDBClient, DynamoDBClientConfig } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

/**
 * DynamoDB Client Initialization
 * Supports AWS Cloud, AWS SAM Local (Docker bridge), and native Localhost testing.
 */

const getDynamoDBConfig = (): DynamoDBClientConfig => {
  const isSamLocal = process.env.AWS_SAM_LOCAL === 'true';
  const customEndpoint = process.env.DYNAMODB_ENDPOINT;
  const region = process.env.AWS_REGION || 'ap-south-1'; // Default to AWS India (Mumbai) region

  console.log(`[DynamoDB Client] Initializing client... Region: ${region}, SAM Local: ${isSamLocal}`);

  const config: DynamoDBClientConfig = {
    region,
  };

  // Route to host.docker.internal if running inside SAM Local container
  if (isSamLocal) {
    const samEndpoint = customEndpoint || 'http://host.docker.internal:8000';
    console.log(`[DynamoDB Client] Detected AWS_SAM_LOCAL=true. Routing to: ${samEndpoint}`);
    config.endpoint = samEndpoint;
    config.credentials = {
      accessKeyId: 'localAccessKey',
      secretAccessKey: 'localSecretKey',
    };
  } else if (customEndpoint) {
    console.log(`[DynamoDB Client] Using custom DYNAMODB_ENDPOINT: ${customEndpoint}`);
    config.endpoint = customEndpoint;
    config.credentials = {
      accessKeyId: 'localAccessKey',
      secretAccessKey: 'localSecretKey',
    };
  }

  return config;
};

// Base low-level client
export const rawClient = new DynamoDBClient(getDynamoDBConfig());

// High-level document client with unmarshalled JS types
export const docClient = DynamoDBDocumentClient.from(rawClient, {
  marshallOptions: {
    convertEmptyValues: false,
    removeUndefinedValues: true,
  },
  unmarshallOptions: {
    wrapNumbers: false,
  },
});

export const getTableName = (): string => {
  const tableName = process.env.TABLE_NAME || 'ClearCaseTable-local';
  return tableName;
};
