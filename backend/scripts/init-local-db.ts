import {
  CreateTableCommand,
  DescribeTableCommand,
  DynamoDBClient,
  UpdateTableCommand,
  UpdateTimeToLiveCommand,
} from '@aws-sdk/client-dynamodb';

const endpoint = process.env.DYNAMODB_ENDPOINT || 'http://localhost:8000';
const region = process.env.AWS_REGION || 'ap-south-1';
const tableName = process.env.TABLE_NAME || 'ClearCaseTable-local';

const client = new DynamoDBClient({
  endpoint,
  region,
  credentials: {
    accessKeyId: 'localAccessKey',
    secretAccessKey: 'localSecretKey',
  },
});

async function initLocalTable() {
  console.log(`[Init DB] Connecting to DynamoDB Local at: ${endpoint}`);
  console.log(`[Init DB] Target Table: ${tableName}`);

  // Check if table already exists
  try {
    const describe = await client.send(
      new DescribeTableCommand({ TableName: tableName })
    );
    console.log(`[Init DB] Table "${tableName}" already exists. Status: ${describe.Table?.TableStatus}`);

    // Idempotent migration: ensure the PartyPhoneIndex (GSI2) exists on older local tables
    const existingIndexes = (describe.Table?.GlobalSecondaryIndexes || []).map(
      (i) => i.IndexName
    );
    if (existingIndexes.includes('PartyPhoneIndex')) {
      console.log(`[Init DB] PartyPhoneIndex already present on "${tableName}". Nothing to migrate.`);
      return;
    }

    console.log(`[Init DB] PartyPhoneIndex missing on "${tableName}". Creating index...`);
    await client.send(
      new UpdateTableCommand({
        TableName: tableName,
        AttributeDefinitions: [
          { AttributeName: 'GSI2PK', AttributeType: 'S' },
        ],
        GlobalSecondaryIndexUpdates: [
          {
            Create: {
              IndexName: 'PartyPhoneIndex',
              KeySchema: [
                { AttributeName: 'GSI2PK', KeyType: 'HASH' },
              ],
              Projection: { ProjectionType: 'ALL' },
            },
          },
        ],
      })
    );
    await waitForIndex(tableName, 'PartyPhoneIndex');
    console.log(`[Init DB] PartyPhoneIndex created and ACTIVE on "${tableName}".`);
    return;
  } catch (err: any) {
    if (err.name !== 'ResourceNotFoundException') {
      console.error(`[Init DB] Unexpected error checking table existence:`, err);
      throw err;
    }
  }

  console.log(`[Init DB] Table not found. Creating table "${tableName}" with Single-Table Design...`);

  await client.send(
    new CreateTableCommand({
      TableName: tableName,
      BillingMode: 'PAY_PER_REQUEST',
      AttributeDefinitions: [
        { AttributeName: 'PK', AttributeType: 'S' },
        { AttributeName: 'SK', AttributeType: 'S' },
        { AttributeName: 'GSI1PK', AttributeType: 'S' },
        { AttributeName: 'GSI1SK', AttributeType: 'S' },
        { AttributeName: 'GSI2PK', AttributeType: 'S' },
      ],
      KeySchema: [
        { AttributeName: 'PK', KeyType: 'HASH' },
        { AttributeName: 'SK', KeyType: 'RANGE' },
      ],
      GlobalSecondaryIndexes: [
        {
          IndexName: 'MediatorQueueIndex',
          KeySchema: [
            { AttributeName: 'GSI1PK', KeyType: 'HASH' },
            { AttributeName: 'GSI1SK', KeyType: 'RANGE' },
          ],
          Projection: {
            ProjectionType: 'ALL',
          },
        },
        {
          IndexName: 'PartyPhoneIndex',
          KeySchema: [
            { AttributeName: 'GSI2PK', KeyType: 'HASH' },
          ],
          Projection: {
            ProjectionType: 'ALL',
          },
        },
      ],
    })
  );

  console.log(`[Init DB] Table "${tableName}" created successfully.`);

  // Enable TTL on otpExpiry
  console.log(`[Init DB] Enabling TTL on attribute "otpExpiry"...`);
  try {
    await client.send(
      new UpdateTimeToLiveCommand({
        TableName: tableName,
        TimeToLiveSpecification: {
          Enabled: true,
          AttributeName: 'otpExpiry',
        },
      })
    );
    console.log(`[Init DB] TTL enabled on "otpExpiry".`);
  } catch (ttlErr: any) {
    console.warn(`[Init DB] TTL configuration warning:`, ttlErr.message);
  }

  console.log(`[Init DB] Local DynamoDB initialization complete! Ready for ClearCase operations.`);
}

async function waitForIndex(table: string, indexName: string, attempts = 20) {
  for (let i = 0; i < attempts; i++) {
    const describe = await client.send(
      new DescribeTableCommand({ TableName: table })
    );
    const index = describe.Table?.GlobalSecondaryIndexes?.find(
      (g) => g.IndexName === indexName
    );
    if (index?.IndexStatus === 'ACTIVE') {
      console.log(`[Init DB] Index "${indexName}" is ACTIVE.`);
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  throw new Error(`[Init DB] Timed out waiting for index "${indexName}" to become ACTIVE.`);
}

initLocalTable().catch((err) => {
  console.error('[Init DB] Initialization failed:', err);
  process.exit(1);
});
