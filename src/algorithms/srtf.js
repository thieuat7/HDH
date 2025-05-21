/**
 * Shortest Remaining Time First (SRTF) CPU scheduling algorithm implementation
 * @param {Array} processes - Array of process objects with pid, arrival, and burst properties
 * @returns {Object} Object containing processed results and gantt chart
 */
export function srtf(processes) {
  // Validate input
  if (!Array.isArray(processes) || processes.length === 0) {
    return { result: [], ganttChart: [] };
  }

  // Create deep copies to avoid modifying original processes
  const n = processes.length;
  const remaining = processes.map(p => ({ 
    ...p, 
    remainingTime: p.burst,
    startTime: undefined,
    completionTime: undefined,
    firstResponse: undefined
  }));
  
  const result = [];
  const ganttChart = [];

  let currentTime = 0;
  let completed = 0;
  let prevRunningPid = null;
  
  // Find earliest arrival time
  const earliestArrival = Math.min(...remaining.map(p => p.arrival));
  
  // Add idle time if no process arrives at time 0
  if (earliestArrival > 0) {
    ganttChart.push({
      pid: "idle",
      start: 0,
      end: earliestArrival
    });
    currentTime = earliestArrival;
  }

  // Continue until all processes are completed
  while (completed < n) {
    // Get processes that have arrived and are not completed
    // eslint-disable-next-line no-loop-func
    const readyProcesses = remaining.filter(p => 
      p.arrival <= currentTime && p.remainingTime > 0
    );

    // If no process is ready at current time
    if (readyProcesses.length === 0) {
      // Find next arrival time
      const nextArrival = Math.min(
        ...remaining
          .filter(p => p.remainingTime > 0)
          .map(p => p.arrival)
      );
      
      // Add idle time to Gantt chart
      ganttChart.push({
        pid: "idle",
        start: currentTime,
        end: nextArrival
      });
      
      currentTime = nextArrival;
      continue;
    }

    // Select process with shortest remaining time
    // If tie, select the one with earlier arrival time
    const currentProcess = readyProcesses.sort((a, b) => 
      a.remainingTime - b.remainingTime || a.arrival - b.arrival
    )[0];

    // Record start time if first execution
    if (currentProcess.startTime === undefined) {
      currentProcess.startTime = currentTime;
    }
    
    // Record first response time if not already set
    if (currentProcess.firstResponse === undefined) {
      currentProcess.firstResponse = currentTime - currentProcess.arrival;
    }

    // Calculate time to next event (process completion or new arrival)
    const timeToNextArrival = remaining
      // eslint-disable-next-line no-loop-func
      .filter(p => p.arrival > currentTime && p.remainingTime > 0)
      // eslint-disable-next-line no-loop-func
      .map(p => p.arrival - currentTime)
      .reduce((min, val) => Math.min(min, val), Infinity);
      
    // Time this process would need to complete
    const timeToComplete = currentProcess.remainingTime;
    
    // Time to next event is minimum of completion time and next arrival
    // but must be at least 1 time unit
    const timeToNextEvent = Math.min(
      timeToNextArrival === Infinity ? timeToComplete : timeToNextArrival, 
      timeToComplete
    );
    
    // If process changes, create new Gantt chart entry
    if (prevRunningPid !== currentProcess.pid) {
      ganttChart.push({
        pid: currentProcess.pid,
        start: currentTime,
        end: currentTime + timeToNextEvent
      });
      prevRunningPid = currentProcess.pid;
    } else {
      // Extend the last Gantt chart entry
      ganttChart[ganttChart.length - 1].end = currentTime + timeToNextEvent;
    }

    // Update remaining time and current time
    currentProcess.remainingTime -= timeToNextEvent;
    currentTime += timeToNextEvent;

    // If process completes
    if (currentProcess.remainingTime === 0) {
      currentProcess.completionTime = currentTime;
      currentProcess.turnaroundTime = currentProcess.completionTime - currentProcess.arrival;
      currentProcess.waitingTime = currentProcess.turnaroundTime - currentProcess.burst;
      currentProcess.responseTime = currentProcess.firstResponse;
      
      result.push({
        pid: currentProcess.pid,
        arrival: currentProcess.arrival,
        burst: currentProcess.burst,
        startTime: currentProcess.startTime,
        completionTime: currentProcess.completionTime,
        turnaroundTime: currentProcess.turnaroundTime,
        waitingTime: currentProcess.waitingTime,
        responseTime: currentProcess.responseTime
      });
      
      completed++;
    }
  }

  // Sort results by process ID for consistent output
  result.sort((a, b) => {
    // Handle numeric and string PIDs
    if (typeof a.pid === 'number' && typeof b.pid === 'number') {
      return a.pid - b.pid;
    }
    return String(a.pid).localeCompare(String(b.pid));
  });

  // Optimize Gantt chart by merging adjacent entries for the same process
  const optimizedGantt = [];
  for (const entry of ganttChart) {
    if (optimizedGantt.length > 0 && 
        optimizedGantt[optimizedGantt.length - 1].pid === entry.pid) {
      // Extend previous entry
      optimizedGantt[optimizedGantt.length - 1].end = entry.end;
    } else {
      // Add new entry
      optimizedGantt.push({...entry});
    }
  }

  // Calculate averages
  const avgTurnaroundTime = result.reduce((sum, p) => sum + p.turnaroundTime, 0) / result.length;
  const avgWaitingTime = result.reduce((sum, p) => sum + p.waitingTime, 0) / result.length;
  const avgResponseTime = result.reduce((sum, p) => sum + p.responseTime, 0) / result.length;
  
  const metrics = {
    avgTurnaroundTime,
    avgWaitingTime,
    avgResponseTime,
  };

  return { result, ganttChart: optimizedGantt, metrics };
}