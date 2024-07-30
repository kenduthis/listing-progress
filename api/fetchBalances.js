const axios = require('axios');
require('dotenv').config();
const fs = require('fs');

const etherscanApiKey = process.env.ETHERSCAN_API_KEY;
const walletAddress = process.env.WALLET_ADDRESS;
const kenduContractAddress = process.env.KENDU_CONTRACT_ADDRESS;

// Fetch ETH balance
async function fetchEthBalance() {
  try {
    const response = await axios.get(`https://api.etherscan.io/api?module=account&action=balance&address=${walletAddress}&tag=latest&apikey=${etherscanApiKey}`);
    return response.data.result / 1e18; // Convert Wei to Ether
  } catch (error) {
    console.error('Error fetching ETH balance:', error);
    throw error;
  }
}

// Fetch USDT balance
async function fetchUsdtBalance() {
  try {
    const response = await axios.get(`https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=0xdAC17F958D2ee523a2206206994597C13D831ec7&address=${walletAddress}&tag=latest&apikey=${etherscanApiKey}`);
    return response.data.result / 1e6; // USDT has 6 decimals
  } catch (error) {
    console.error('Error fetching USDT balance:', error);
    throw error;
  }
}

// Fetch Kendu token balance
async function fetchKenduBalance() {
  try {
    const response = await axios.get(`https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=${kenduContractAddress}&address=${walletAddress}&tag=latest&apikey=${etherscanApiKey}`);
    return response.data.result / 1e18; // Assuming Kendu has 18 decimals
  } catch (error) {
    console.error('Error fetching Kendu balance:', error);
    throw error;
  }
}

// Fetch current ETH to USD exchange rate from CoinGecko
async function fetchEthToUsdRate() {
  try {
    const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
    return response.data.ethereum.usd;
  } catch (error) {
    console.error('Error fetching ETH to USD rate:', error);
    throw error;
  }
}

// Fetch current Kendu token to USD exchange rate from CoinGecko
async function fetchKenduToUsdRate() {
  try {
    const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=kendu-token&vs_currencies=usd'); // Replace 'kendu-token' with the actual ID on CoinGecko
    return response.data['kendu-token'].usd;
  } catch (error) {
    console.error('Error fetching Kendu to USD rate:', error);
    throw error;
  }
}

async function fetchBalances() {
  try {
    const ethBalance = await fetchEthBalance();
    const usdtBalance = await fetchUsdtBalance();
    const kenduBalance = await fetchKenduBalance();
    const ethToUsdRate = await fetchEthToUsdRate();
    const kenduToUsdRate = await fetchKenduToUsdRate();

    const ethBalanceInUsd = ethBalance * ethToUsdRate;
    const kenduBalanceInUsd = kenduBalance * kenduToUsdRate;
    const totalUsdBalance = usdtBalance + ethBalanceInUsd;

    const data = {
      ethBalance,
      usdtBalance,
      kenduBalance,
      ethBalanceInUsd,
      kenduBalanceInUsd,
      totalUsdBalance
    };

    console.log(data);

    // Write data to JSON file with appropriate permissions
    fs.writeFileSync('public/balances.json', JSON.stringify(data, null, 2), { mode: 0o600 });

    return data;
  } catch (error) {
    console.error('Error fetching balances:', error);
    throw error;
  }
}

if (require.main === module) {
  fetchBalances().catch(console.error);
}
