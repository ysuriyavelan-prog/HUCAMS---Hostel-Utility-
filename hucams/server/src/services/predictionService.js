exports.predictConsumption = (pastReadings) => {
    // Simple Moving Average (Last 7 days)
    if (!pastReadings || pastReadings.length === 0) return 0;

    const total = pastReadings.reduce((sum, reading) => sum + reading, 0);
    return total / pastReadings.length;
};

exports.predictNextWeek = (recentReadings) => {
    // Linear Regression (simple implementation)
    // y = mx + c
    const n = recentReadings.length;
    if (n < 2) return [];

    let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
    for (let i = 0; i < n; i++) {
        sumX += i;
        sumY += recentReadings[i];
        sumXY += i * recentReadings[i];
        sumXX += i * i;
    }

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    const predictions = [];
    for (let i = 1; i <= 7; i++) {
        predictions.push(slope * (n - 1 + i) + intercept);
    }
    return predictions;
};
