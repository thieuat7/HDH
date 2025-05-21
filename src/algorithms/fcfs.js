

/**
 * First-Come-First-Serve (FCFS) CPU scheduling algorithm implementation
 * @param {Array} processes - Array of process objects with pid, arrival, and burst properties
 * @returns {Object} Object containing processed results and gantt chart
 */
export function fcfs(processes) {
  // Validate input
  if (!Array.isArray(processes) || processes.length === 0) {
    return { result: [], ganttChart: [] };
  }

  let currentTime = 0;
  const ganttChart = [];
  
  // Create a deep copy of processes and sort by arrival time
  const result = processes
    .map(p => ({...p})) // Create deep copy to avoid modifying original array
    .sort((a, b) => a.arrival - b.arrival || a.pid - b.pid) // Sort by arrival time, then by PID if arrival times are equal
    .map((p) => {
      // Process can't start before it arrives
      const startTime = Math.max(currentTime, p.arrival);
      const completionTime = startTime + p.burst;
      const turnaroundTime = completionTime - p.arrival;
      const waitingTime = turnaroundTime - p.burst;
      const responseTime = startTime - p.arrival;

      // Add to Gantt chart if there's actual processing time
      if (p.burst > 0) {
        // If there's idle time, add it to Gantt chart
        if (startTime > currentTime) {
          ganttChart.push({
            pid: "idle",
            start: currentTime,
            end: startTime,
          });
        }
        
        // Add process execution to Gantt chart
        ganttChart.push({
          pid: p.pid,
          start: startTime,
          end: completionTime,
        });
      }

      // Update current time
      currentTime = completionTime;

      return {
        ...p,
        startTime,
        completionTime,
        turnaroundTime,
        waitingTime,
        responseTime,
      };
    });

  // Calculate averages
  const avgTurnaroundTime = result.reduce((sum, p) => sum + p.turnaroundTime, 0) / result.length;
  const avgWaitingTime = result.reduce((sum, p) => sum + p.waitingTime, 0) / result.length;
  const avgResponseTime = result.reduce((sum, p) => sum + p.responseTime, 0) / result.length;
  
  // Include metrics in return value
  const metrics = {
    avgTurnaroundTime,
    avgWaitingTime,
    avgResponseTime,
  };

  return { result, ganttChart, metrics };
}