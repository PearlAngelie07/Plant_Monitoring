document.addEventListener('DOMContentLoaded', (event) => {
    fetchCurrentData();
});

function fetchCurrentData() {
    fetch('https://sheets.googleapis.com/v4/spreadsheets/1neoLEGAfpZmb_7oXklEyv_p_zDSIz9OUHshGpYl2wMU/values/Sheet1?key=YOUR_API_KEY')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const latestRow = data.values[data.values.length - 1]; // Get the latest row
            if (latestRow) {
                const [timestamp, temperature, humidity] = latestRow;
                document.getElementById('humidity').textContent = humidity;
                document.getElementById('temperature').textContent = temperature;
                updateGraphs({ humidity, temperature });
            } else {
                console.error('No data found');
            }
        })
        .catch(error => {
            console.error('There was a problem with your fetch operation:', error);
        });
}

function updateGraphs(data) {
    const timeLabels = [...Array(24).keys()].map(hour => `${hour}:00`).filter((_, i) => i % 2 === 0); // 2-hour intervals

    const dummyData = {
        humidity: Array.from({ length: 12 }, () => Math.floor(Math.random() * 100)),
        temperature: Array.from({ length: 12 }, () => Math.floor(Math.random() * 35))
    };

    const graphs = [
        { id: 'humidity-graph', label: 'Humidity', data: dummyData.humidity, borderColor: 'rgba(75, 192, 192, 1)' },
        { id: 'temperature-graph', label: 'Temperature', data: dummyData.temperature, borderColor: 'rgba(255, 159, 64, 1)' }
    ];

    graphs.forEach(graph => {
        const ctx = document.getElementById(graph.id).getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: timeLabels,
                datasets: [{
                    label: graph.label,
                    data: graph.data,
                    borderColor: graph.borderColor,
                    backgroundColor: 'rgba(0, 0, 0, 0.1)',
                    borderWidth: 2,
                    pointRadius: 3,
                    pointBackgroundColor: graph.borderColor
                }]
            },
            options: {
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Time'
                        }
                    },
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: graph.label
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    }
                }
            }
        });
    });
}

function fetchHistoricalData() {
    const date = document.getElementById('date-picker').value;
    fetch(`https://sheets.googleapis.com/v4/spreadsheets/1neoLEGAfpZmb_7oXklEyv_p_zDSIz9OUHshGpYl2wMU/values/Sheet1?key=YOUR_API_KEY`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const rows = data.values;
            const filteredRows = rows.filter(row => row[0].includes(date));
            if (filteredRows.length > 0) {
                const latestRow = filteredRows[filteredRows.length - 1];
                const [timestamp, temperature, humidity] = latestRow;
                document.getElementById('historical-info').innerHTML = `
                    <p>Humidity: ${humidity}</p>
                    <p>Temperature: ${temperature}</p>
                `;
            } else {
                document.getElementById('historical-info').innerHTML = '<p>No data found for this date.</p>';
            }
        })
        .catch(error => {
            console.error('There was a problem with your fetch operation:', error);
        });
}
