async function fetchProgress() {
    const response = await fetch('/public/balances.json');
    const data = await response.json();
  
    // Calculate progress for USDT + ETH towards $70,000
    const usdtEthProgress = (data.totalUsdBalance / 70000) * 100;
    // Calculate progress for Kendu towards $90,000
    const kenduProgress = (data.kenduBalanceInUsd / 90000) * 100;
  
    const usdtEthProgressBar = document.getElementById('usdtEthProgress');
    const kenduProgressBar = document.getElementById('kenduProgress');
  
    usdtEthProgressBar.style.setProperty('--width', `${usdtEthProgress}%`);
    kenduProgressBar.style.setProperty('--width', `${kenduProgress}%`);
  
    usdtEthProgressBar.innerText = `${usdtEthProgress.toFixed(2)}%`;
    kenduProgressBar.innerText = `${kenduProgress.toFixed(2)}%`;
  }
  
  fetchProgress();
  
