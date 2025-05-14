export function rr(processes, quantum) {
  const result = [];
  let currentTime = 0;
  const queue = [];
  const remaining = [...processes];  // Tạo bản sao của processes
  const remainingBurst = { ...processes.reduce((acc, p) => {
    acc[p.pid] = p.burst;
    return acc;
  }, {})};  // Bản sao burstTime để theo dõi tiến trình

  const completion = {};
  const visited = new Set();

  while (remaining.length > 0 || queue.length > 0) {
    // Đưa tiến trình vào queue nếu chúng đến trước currentTime
    for (let i = 0; i < remaining.length; i++) {
      const p = remaining[i];
      if (p.arrival <= currentTime && !visited.has(p.pid)) {
        queue.push(p);
        visited.add(p.pid);
        remaining.splice(i, 1); // Xoá tiến trình đã được đưa vào hàng đợi
        i--; // Điều chỉnh chỉ số khi xoá phần tử
      }
    }

    if (queue.length === 0) {
      // Nếu không có tiến trình nào trong queue, cập nhật currentTime
      currentTime = remaining[0]?.arrival || currentTime;
      continue;
    }

    // Lấy tiến trình tiếp theo trong hàng đợi
    const p = queue.shift();
    const execTime = Math.min(quantum, remainingBurst[p.pid]);

    if (p.startTime === undefined) p.startTime = currentTime;  // Gán startTime nếu chưa có

    remainingBurst[p.pid] -= execTime;
    currentTime += execTime;

    // Nếu tiến trình hoàn thành
    if (remainingBurst[p.pid] <= 0) {
      completion[p.pid] = currentTime;
      const turnaroundTime = completion[p.pid] - p.arrival;
      const waitingTime = turnaroundTime - p.burst;

      result.push({
        pid: p.pid,
        arrival: p.arrival,
        burst: p.burst,
        startTime: p.startTime,
        completionTime: completion[p.pid],
        turnaroundTime,
        waitingTime
      });
    } else {
      // Tiến trình chưa hoàn thành, đưa lại vào hàng đợi
      queue.push(p);
    }
  }

  return result;
}
