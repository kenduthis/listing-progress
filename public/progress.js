async function fetchProgress() {
    try {
        const response = await fetch('/balances.json');
        const data = await response.json();

        // Calculate progress for USDT + ETH towards $70,000
        const usdtEthProgress = (data.totalUsdBalance / 70000) * 100;
        // Calculate progress for Kendu towards $90,000
        const kenduProgress = (data.kenduBalanceInUsd / 90000) * 100;

        const usdtEthProgressBar = document.getElementById('usdtEthProgress').firstElementChild;
        const kenduProgressBar = document.getElementById('kenduProgress').firstElementChild;

        usdtEthProgressBar.style.width = `${usdtEthProgress}%`;
        usdtEthProgressBar.innerText = `${usdtEthProgress.toFixed(2)}%`;
        kenduProgressBar.style.width = `${kenduProgress}%`;
        kenduProgressBar.innerText = `${kenduProgress.toFixed(2)}%`;

        // Calculate and display missing amounts
        const missingUsdtEth = 70000 - data.totalUsdBalance;
        const missingKendu = 90000 - data.kenduBalanceInUsd;

        document.getElementById('missingUsdtEth').innerText = `Missing USD for listing: $${missingUsdtEth.toFixed(2)}`;
        document.getElementById('missingKendu').innerText = `Missing Kendu in USD for listing: $${missingKendu.toFixed(2)}`;
    } catch (error) {
        console.error('Error fetching progress:', error);
    }
}

fetchProgress();
