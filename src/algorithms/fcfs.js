export function fcfs(processes) {
  let currentTime = 0;
  const result = processes
    .slice()
    .sort((a, b) => a.arrival - b.arrival) // sửa lại ở đây
    .map((p) => {
      const startTime = Math.max(currentTime, p.arrival);
      const completionTime = startTime + p.burst;
      const turnaroundTime = completionTime - p.arrival;
      const waitingTime = turnaroundTime - p.burst;

      currentTime = completionTime;

      return {
        ...p,
        startTime,
        completionTime,
        turnaroundTime,
        waitingTime,
      };
    });
    console.log(result);
  return result;
}
