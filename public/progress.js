async function fetchProgress() {
    try {
        const response = await fetch('/balances.json');
        const data = await response.json();

        // Calculate progress for USDT + ETH towards $70,000
        const usdtEthProgress = Math.min((data.totalUsdBalance / 90000) * 100, 100);
        // Calculate progress for Kendu towards $90,000
        const kenduProgress = Math.min((data.kenduBalanceInUsd / 70000) * 100, 100);

        const usdtEthProgressBar = document.getElementById('usdtEthProgress').firstElementChild;
        const kenduProgressBar = document.getElementById('kenduProgress').firstElementChild;

        usdtEthProgressBar.style.width = `${usdtEthProgress.toFixed(2)}%`;
        kenduProgressBar.style.width = `${kenduProgress.toFixed(2)}%`;

        // Check if the goals are reached
        if (usdtEthProgress >= 100) {
            usdtEthProgressBar.innerText = '100% ✓';
            usdtEthProgressBar.parentNode.classList.add('complete');
            document.getElementById('missingUsdtEth').innerText = 'Reached ETH + USD donations goal ✓';
        } else {
            usdtEthProgressBar.innerText = `${usdtEthProgress.toFixed(2)}%`;
            const missingUsdtEth = 90000 - data.totalUsdBalance;
            document.getElementById('missingUsdtEth').innerText = `Missing USD for listing: $${missingUsdtEth.toFixed(2)}`;
        }

        if (kenduProgress >= 100) {
            kenduProgressBar.innerText = '100% ✓';
            kenduProgressBar.parentNode.classList.add('complete');
            document.getElementById('missingKendu').innerText = 'Reached Kendu donations goal ✓';
        } else {
            kenduProgressBar.innerText = `${kenduProgress.toFixed(2)}%`;
            const missingKendu = 70000 - data.kenduBalanceInUsd;
            document.getElementById('missingKendu').innerText = `Missing Kendu in USD for listing: $${missingKendu.toFixed(2)}`;
        }
    } catch (error) {
        console.error('Error fetching progress:', error);
    }
}

fetchProgress();
