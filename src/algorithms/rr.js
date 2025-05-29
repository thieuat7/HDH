/**
 * Round Robin (RR) CPU scheduling algorithm implementation
 * @param {Array} processes - Array of process objects with pid, arrival, and burst properties
 * @param {Number} quantum - Time quantum for each process execution
 * @returns {Object} Object containing processed results and gantt chart
 */
export function rr(processes, quantum) {
  // Validate input
  if (!Array.isArray(processes) || processes.length === 0 || !quantum || quantum <= 0) {
    return { result: [], ganttChart: [] };
  }

  // Deep copy processes to avoid modifying original
  const processCopy = processes.map(p => ({...p}));
  
  // Sort by arrival time
  processCopy.sort((a, b) => a.arrival - b.arrival);
  
  let currentTime = 0;
  const ganttChart = [];
  const remainingProcesses = [...processCopy];
  const readyQueue = [];
  
  // Track remaining burst time, completion times, start times
  const remainingBurst = {};
  const completionTime = {};
  const startTime = {};
  const responseTime = {};
  
  // Initialize remaining burst time
  processCopy.forEach(p => {
    remainingBurst[p.pid] = p.burst;
  });

  // Include idle time if first process arrives after time 0
  if (remainingProcesses[0]?.arrival > 0) {
    ganttChart.push({
      pid: "idle",
      start: 0,
      end: remainingProcesses[0].arrival
    });
    currentTime = remainingProcesses[0].arrival;
  }

  // Main scheduling loop
  while (remainingProcesses.length > 0 || readyQueue.length > 0) {
    // Add newly arrived processes to ready queue
    while (remainingProcesses.length > 0 && remainingProcesses[0].arrival <= currentTime) {
      const newProcess = remainingProcesses.shift();
      readyQueue.push(newProcess);
    }

    // Handle case when no process is in ready queue but processes will arrive later
    if (readyQueue.length === 0 && remainingProcesses.length > 0) {
      ganttChart.push({
        pid: "idle",
        start: currentTime,
        end: remainingProcesses[0].arrival
      });
      currentTime = remainingProcesses[0].arrival;
      continue;
    }

    // Execute the next process in ready queue
    if (readyQueue.length > 0) {
      const currentProcess = readyQueue.shift();
      const pid = currentProcess.pid;
      
      // Record start time if first execution
      if (startTime[pid] === undefined) {
        startTime[pid] = currentTime;
        responseTime[pid] = startTime[pid] - currentProcess.arrival;
      }

      // Calculate execution time for this quantum
      const execTime = Math.min(quantum, remainingBurst[pid]);
      
      // Add to Gantt chart
      ganttChart.push({
        pid: pid,
        start: currentTime,
        end: currentTime + execTime
      });
      
      // Update remaining burst time and current time
      remainingBurst[pid] -= execTime;
      currentTime += execTime;

      // Check if process is complete
      if (remainingBurst[pid] <= 0) {
        completionTime[pid] = currentTime;
      } else {
        // Check for any new arrivals before re-adding to queue
        while (remainingProcesses.length > 0 && remainingProcesses[0].arrival <= currentTime) {
          const newProcess = remainingProcesses.shift();
          readyQueue.push(newProcess);
        }
        // Add back to ready queue
        readyQueue.push(currentProcess);
      }
    }
  }

  // Prepare results
  const result = processCopy.map(p => {
    const pid = p.pid;
    const turnaroundTime = completionTime[pid] - p.arrival;
    const waitingTime = turnaroundTime - p.burst;
    
    return {
      pid: pid,
      arrival: p.arrival,
      burst: p.burst,
      startTime: startTime[pid],
      completionTime: completionTime[pid],
      turnaroundTime: turnaroundTime,
      waitingTime: waitingTime,
      responseTime: responseTime[pid]
    };
  });

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
