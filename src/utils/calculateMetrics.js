// src/utils/calculateMetrics.js

export function calculateMetrics(processes) {
  let totalWaitingTime = 0;
  let totalTurnaroundTime = 0;
  let totalCompletionTime = 0;

  processes.forEach((p) => {
    totalWaitingTime += p.waitingTime;
    totalTurnaroundTime += p.turnaroundTime;
    totalCompletionTime += p.completionTime;
  });

  const n = processes.length;

  const avgWaitingTime = totalWaitingTime / n;
  const avgTurnaroundTime = totalTurnaroundTime / n;
  const avgCompletionTime = totalCompletionTime / n;

  return {
    avgWaitingTime,
    avgTurnaroundTime,
    avgCompletionTime,
  };
}
