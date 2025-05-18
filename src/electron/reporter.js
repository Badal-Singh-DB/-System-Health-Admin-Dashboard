import axios from 'axios';

// Function to report health data to the API
export async function reportHealthData(healthData, apiEndpoint) {
  try {
    const response = await axios.post(apiEndpoint, healthData, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 10000 // 10 second timeout
    });
    
    console.log('Health data reported successfully:', response.status);
    return true;
  } catch (error) {
    console.error('Failed to report health data:', error);
    
    // Store failed reports to retry later
    storeFailedReport(healthData);
    return false;
  }
}

// Store failed reports for retry
function storeFailedReport(healthData) {
  try {
    // Get existing failed reports
    const failedReportsString = localStorage.getItem('failedReports');
    const failedReports = failedReportsString ? JSON.parse(failedReportsString) : [];
    
    // Add new failed report
    failedReports.push({
      data: healthData,
      timestamp: Date.now()
    });
    
    // Store back, limit to last 10 to prevent excessive storage use
    localStorage.setItem('failedReports', JSON.stringify(failedReports.slice(-10)));
  } catch (error) {
    console.error('Failed to store failed report:', error);
  }
}

// Function to retry sending failed reports
export async function retryFailedReports(apiEndpoint) {
  try {
    const failedReportsString = localStorage.getItem('failedReports');
    if (!failedReportsString) return;
    
    const failedReports = JSON.parse(failedReportsString);
    if (failedReports.length === 0) return;
    
    // Create a new array for reports that still fail
    const stillFailedReports = [];
    
    // Try to send each failed report
    for (const report of failedReports) {
      try {
        const success = await reportHealthData(report.data, apiEndpoint);
        if (!success) {
          stillFailedReports.push(report);
        }
      } catch (error) {
        console.error('Error retrying report:', error);
        stillFailedReports.push(report);
      }
    }
    
    // Update localStorage with reports that still failed
    localStorage.setItem('failedReports', JSON.stringify(stillFailedReports));
    
    console.log(`Retry complete. ${failedReports.length - stillFailedReports.length} reports succeeded, ${stillFailedReports.length} still failed.`);
  } catch (error) {
    console.error('Error in retry process:', error);
  }
}