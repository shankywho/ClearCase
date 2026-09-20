import fs from 'fs';
import path from 'path';

// 1. Load .env
const envPath = path.resolve(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const idx = trimmed.indexOf('=');
      const key = trimmed.substring(0, idx).trim();
      const val = trimmed.substring(idx + 1).trim();
      if (!process.env[key]) {
        process.env[key] = val;
      }
    }
  }
}

import { ethers } from 'ethers';
import { generateSettlementHash } from '../src/services/blockchainService';

async function main() {
  console.log('================================================================');
  console.log('   CLEARCASE: LIVE POLYGON AMOY SMART CONTRACT DEPLOY & ANCHOR  ');
  console.log('================================================================');

  const rpcUrl = process.env.POLYGON_RPC_URL || 'https://polygon-amoy.drpc.org';
  const privateKey = process.env.PRIVATE_KEY;

  if (!privateKey) {
    console.error('❌ No PRIVATE_KEY found in backend/.env');
    return;
  }

  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(privateKey, provider);

  console.log(`📡 Network: Polygon Amoy Testnet (Chain ID: 80002)`);
  console.log(`👤 Deployer Address: ${wallet.address}`);

  const balance = await provider.getBalance(wallet.address);
  console.log(`💰 Balance: ${ethers.formatEther(balance)} POL`);

  if (balance === 0n) {
    console.error('❌ Balance is 0 POL. Please ensure faucet tokens have arrived.');
    return;
  }

  // 2. Read compiled ABI and Bytecode
  const abiPath = path.resolve(__dirname, '../contracts/build/contracts_ClearCaseRegistry_sol_ClearCaseRegistry.abi');
  const binPath = path.resolve(__dirname, '../contracts/build/contracts_ClearCaseRegistry_sol_ClearCaseRegistry.bin');

  const abi = JSON.parse(fs.readFileSync(abiPath, 'utf8'));
  const bytecode = '0x' + fs.readFileSync(binPath, 'utf8').trim();

  // 3. Deploy Contract
  console.log('\n🚀 Deploying ClearCaseRegistry.sol to Polygon Amoy...');
  const factory = new ethers.ContractFactory(abi, bytecode, wallet);
  const contract = await factory.deploy();
  console.log(`⏳ Deployment transaction submitted: ${contract.deploymentTransaction()?.hash}`);
  console.log('⏳ Waiting for block confirmation on Polygon Amoy...');

  await contract.waitForDeployment();
  const contractAddress = await contract.getAddress();
  console.log(`✅ Smart Contract Deployed Successfully at: ${contractAddress}`);
  console.log(`🔗 Contract on Polygonscan: https://amoy.polygonscan.com/address/${contractAddress}`);

  // 4. Update backend/.env with the deployed contract address
  let envContent = fs.readFileSync(envPath, 'utf8');
  if (envContent.includes('CLEARCASE_REGISTRY_ADDRESS=')) {
    envContent = envContent.replace(/CLEARCASE_REGISTRY_ADDRESS=0x[a-fA-F0-9]+/g, `CLEARCASE_REGISTRY_ADDRESS=${contractAddress}`);
  } else {
    envContent += `\nCLEARCASE_REGISTRY_ADDRESS=${contractAddress}`;
  }
  fs.writeFileSync(envPath, envContent, 'utf8');
  console.log(`💾 Saved CLEARCASE_REGISTRY_ADDRESS=${contractAddress} to backend/.env`);

  // 5. Broadcast our first live Case settlement
  const caseId = 'CASE-2026-VNS-001';
  const settlementText = 'Boundary ridge restored along 1982 cadastre coordinates (Plot 412/1). Both landholders maintain joint demarcation.';
  const parties = ['+919876543210', '+919123456780'];

  const settlementHash = generateSettlementHash(caseId, settlementText, parties);
  console.log(`\n⚡ Anchoring settlement on-chain for Case: ${caseId}`);
  console.log(`🔒 Settlement SHA-256 Hash: ${settlementHash}`);

  const liveContract = new ethers.Contract(contractAddress, abi, wallet);
  console.log(`📡 Broadcasting recordSettlement transaction...`);
  const tx = await liveContract.recordSettlement(settlementHash);
  console.log(`⏳ Settlement Tx submitted: ${tx.hash}`);
  console.log(`⏳ Waiting for block confirmation...`);

  const receipt = await tx.wait(1);
  console.log(`\n================================================================`);
  console.log(`🎉 ON-CHAIN SETTLEMENT IMMUTABLY CONFIRMED ON POLYGON AMOY!`);
  console.log(`📦 Block Height: #${receipt.blockNumber}`);
  console.log(`⛽ Gas Used: ${receipt.gasUsed?.toString()}`);
  console.log(`🔗 Live Polygonscan Tx: https://amoy.polygonscan.com/tx/${tx.hash}`);
  console.log(`🔗 Contract Address: https://amoy.polygonscan.com/address/${contractAddress}`);
  console.log(`================================================================`);

  // Return receipt details for frontend synchronization
  return {
    txHash: tx.hash,
    blockNumber: receipt.blockNumber,
    contractAddress,
    settlementHash,
  };
}

main().catch((err) => {
  console.error('Fatal error:', err);
});
