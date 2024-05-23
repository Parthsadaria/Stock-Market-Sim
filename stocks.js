let cashBalance = 10000;
const stocks = [
    { name: 'Apple', ticker: 'AAPL', price: 235.86, shares: 0, history: [] },
    { name: 'Google', ticker: 'GOOG', price: 1214.52, shares: 0, history: [] },
    { name: 'Tesla', ticker: 'TSLA', price: 248.13, shares: 0, history: [] },
    { name: 'Microsoft', ticker: 'MSFT', price: 139.86, shares: 0, history: [] },
    { name: 'Facebook', ticker: 'FB', price: 184.93, shares: 0, history: [] },
    { name: 'Amazon', ticker: 'AMZN', price: 1730.56, shares: 0, history: [] },
    { name: 'Nike', ticker: 'NKE', price: 94.93, shares: 0, history: [] },
    { name: 'Intel', ticker: 'INTC', price: 57.17, shares: 0, history: [] }
];

let chart;
let currentChartElement;
let currentStockIndex = null;

function renderStocks() {
    const stockTable = document.getElementById('stockTable');
    stockTable.innerHTML = '';
    stocks.forEach((stock, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><button onclick="showChart(${index}, this)">${stock.name}</button></td>
            <td>${stock.ticker}</td>
            <td id="price-${index}">${stock.price.toFixed(2)}</td>
            <td>${stock.shares}</td>
            <td><button onclick="buyStock(${index})">Buy 1 Share</button></td>
            <td><button onclick="sellStock(${index})">Sell 1 Share</button></td>
        `;
        stockTable.appendChild(row);
    });
    document.getElementById('balance').innerText = `Cash Balance: $${cashBalance.toFixed(2)}`;
}

function buyStock(index) {
    const stock = stocks[index];
    if (cashBalance >= stock.price) {
        stock.shares++;
        cashBalance -= stock.price;
        addToHistory(`Bought 1 share of ${stock.name} at $${stock.price.toFixed(2)}`);
        renderStocks();
    } else {
        alert('Not enough cash to buy this stock.');
    }
}

function sellStock(index) {
    const stock = stocks[index];
    if (stock.shares > 0) {
        stock.shares--;
        cashBalance += stock.price;
        addToHistory(`Sold 1 share of ${stock.name} at $${stock.price.toFixed(2)}`);
        renderStocks();
    } else {
        alert('No shares to sell.');
    }
}

function addToHistory(message) {
    const history = document.getElementById('history');
    const listItem = document.createElement('li');
    listItem.innerText = message;
    history.appendChild(listItem);
}

function updatePrices() {
    const now = new Date();
    stocks.forEach((stock, index) => {
        const change = (Math.random() - 0.5) * 4;
        stock.price += change;
        if (stock.price < 1) stock.price = 1; // Ensure price doesn't go below 1
        stock.history.push({ time: now, price: stock.price });

        // Update price cell directly
        const priceCell = document.getElementById(`price-${index}`);
        if (priceCell) {
            priceCell.innerText = stock.price.toFixed(2);
        }
    });
    if (currentStockIndex !== null) {
        updateChart(currentStockIndex);
    }
    document.getElementById('balance').innerText = `Cash Balance: $${cashBalance.toFixed(2)}`;
}

function showChart(index, element) {
    if (currentChartElement) {
        currentChartElement.remove();
    }

    const stock = stocks[index];
    const row = element.parentNode.parentNode;
    const chartRow = document.createElement('tr');
    const chartCell = document.createElement('td');
    chartCell.colSpan = 6;
    chartCell.innerHTML = `
        <div class="chartSection" id="chartSection">
            <h2 id="chartTitle">${stock.name} (${stock.ticker}) Price Over Time</h2>
            <canvas id="priceChart" width="600" height="400"></canvas>
        </div>
    `;
    chartRow.appendChild(chartCell);
    row.parentNode.insertBefore(chartRow, row.nextSibling);
    currentChartElement = chartRow;
    currentStockIndex = index;
    updateChart(index);
}

function updateChart(index) {
    const stock = stocks[index];
    const ctx = document.getElementById('priceChart').getContext('2d');
    const labels = stock.history.map(entry => entry.time);
    const data = stock.history.map(entry => entry.price);

    if (chart) {
        chart.destroy();
    }

    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: `${stock.name} (${stock.ticker}) Price`,
                data: data,
                borderColor: '#ffc107',
                backgroundColor: 'transparent',
                borderWidth: 2,
                pointBackgroundColor: '#ffffff',
                pointRadius: 3,
                pointHoverRadius: 5
            }]
        },
        options: {
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'minute', // Display in minutes
                        tooltipFormat: 'lll', // Format for tooltip
                        displayFormats: {
                            minute: 'h:mm a' // Format for x-axis labels
                        }
                    },
                    ticks: {
                        color: '#ffffff'
                    }
                },
                y: {
                    beginAtZero: false,
                    ticks: {
                        color: '#ffffff'
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: '#ffffff'
                    }
                }
            }
        }
    });

    document.getElementById('chartSection').style.display = 'block';
}

function startGame() {
    const usernameInput = document.getElementById('usernameInput').value;
    const balanceInput = parseFloat(document.getElementById('balanceInput').value);

    if (usernameInput.trim() === '' || isNaN(balanceInput) || balanceInput <= 0) {
        alert('Please enter a valid username and starting balance.');
        return;
    }

    cashBalance = balanceInput;
    document.getElementById('popup').style.display = 'none';
    renderStocks();
}

renderStocks();
setInterval(updatePrices, 1000); // Update prices every 2 seconds
