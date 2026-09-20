import fs from 'fs';
import path from 'path';

// Load .env manually without extra deps
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
import { anchorSettlement, generateSettlementHash } from '../src/services/blockchainService';

async function main() {
  console.log('--- Checking Polygon Amoy Wallet & Broadcasting Live ---');
  
  // Use public resilient Amoy RPCs
  const rpcUrl = process.env.POLYGON_RPC_URL || 'https://rpc-amoy.polygon.technology/';
  const privateKey = process.env.PRIVATE_KEY;
  
  if (!privateKey) {
    console.error('No PRIVATE_KEY found in backend/.env');
    return;
  }
  
  console.log(`Connecting to Polygon Amoy via: ${rpcUrl}...`);
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(privateKey, provider);
  
  console.log('Wallet Address:', wallet.address);
  
  try {
    const balance = await provider.getBalance(wallet.address);
    const balanceEth = ethers.formatEther(balance);
    console.log(`POL Balance: ${balanceEth} POL`);
    
    if (balance === 0n) {
      console.warn('Balance is currently 0 POL. (Wait a few seconds if the faucet transaction is still indexing).');
      return;
    }
    
    const caseId = 'CASE-2026-VNS-001';
    const settlementText = 'Boundary ridge restored along 1982 cadastre coordinates. Both landholders maintain joint demarcation.';
    const parties = ['+919876543210', '+919123456780'];
    
    const settlementHash = generateSettlementHash(caseId, settlementText, parties);
    console.log('Generated Settlement Hash:', settlementHash);
    
    console.log('\nAnchoring settlement to Polygon Amoy...');
    const receipt = await anchorSettlement(settlementHash, caseId);
    
    console.log('\n================ SUCCESS ================');
    console.log('Transaction Hash:', receipt.txHash);
    console.log('Block Number:', receipt.blockNumber);
    console.log('Explorer URL:', receipt.explorerUrl);
    console.log('=========================================');
  } catch (err: any) {
    console.error('Error during broadcast:', err.message || err);
  }
}

main();
