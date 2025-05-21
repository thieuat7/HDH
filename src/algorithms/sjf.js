/* eslint-disable no-loop-func */

/**
 * Shortest Job First (SJF) CPU scheduling algorithm implementation
 * @param {Array} processes - Array of process objects with pid, arrival, and burst properties
 * @returns {Object} Object containing processed results and gantt chart
 */
export function sjf(processes) {
  // Validate input
  if (!Array.isArray(processes) || processes.length === 0) {
    return { result: [], ganttChart: [] };
  }

  // Create a deep copy of processes to avoid modifying original
  const processCopy = processes.map(p => ({...p}));
  
  let currentTime = 0;
  const completed = new Set();
  const result = [];
  const ganttChart = [];

  // Include idle time if first process doesn't arrive at time 0
  const earliestArrival = Math.min(...processCopy.map(p => p.arrival));
  if (earliestArrival > 0) {
    ganttChart.push({
      pid: "idle",
      start: 0,
      end: earliestArrival
    });
    currentTime = earliestArrival;
  }

  while (completed.size < processCopy.length) {
    // Filter processes that have arrived and are not yet completed
    const available = processCopy
      .filter(p => p.arrival <= currentTime && !completed.has(p.pid));
      
    if (available.length === 0) {
      // No processes available at current time - find next arrival time
      const nextArrivals = processCopy
        .filter(p => !completed.has(p.pid))
        .map(p => p.arrival);
        
      const nextArrival = Math.min(...nextArrivals);
      
      // Add idle time to Gantt chart
      ganttChart.push({
        pid: "idle",
        start: currentTime,
        end: nextArrival
      });
      
      currentTime = nextArrival;
      continue;
    }
    
    // Sort available processes by burst time (shortest first)
    // If burst times are equal, sort by arrival time (FCFS as tie-breaker)
    const p = available.sort((a, b) => 
      a.burst - b.burst || a.arrival - b.arrival
    )[0];
    
    const startTime = currentTime;
    const completionTime = startTime + p.burst;
    const turnaroundTime = completionTime - p.arrival;
    const waitingTime = turnaroundTime - p.burst;
    const responseTime = startTime - p.arrival;

    // Add to Gantt chart
    ganttChart.push({
      pid: p.pid,
      start: startTime,
      end: completionTime
    });

    // Save process results
    result.push({
      ...p,
      startTime,
      completionTime,
      turnaroundTime,
      waitingTime,
      responseTime
    });

    // Update current time and mark process as completed
    currentTime = completionTime;
    completed.add(p.pid);
  }

  // Sort results by process ID for consistency
  result.sort((a, b) => a.pid - b.pid);

  // Calculate averages
  const avgTurnaroundTime = result.reduce((sum, p) => sum + p.turnaroundTime, 0) / result.length;
  const avgWaitingTime = result.reduce((sum, p) => sum + p.waitingTime, 0) / result.length;
  const avgResponseTime = result.reduce((sum, p) => sum + p.responseTime, 0) / result.length;
  
  const metrics = {
    avgTurnaroundTime,
    avgWaitingTime,
    avgResponseTime,
  };

  return { result, ganttChart, metrics };
}