export function srtf(processes) {
  const n = processes.length;
  const remaining = processes.map((p) => ({ ...p, remainingTime: p.burst })); // Lưu bản sao với thời gian còn lại
  const result = [];
  let currentTime = 0;
  let completed = 0;

  while (completed < n) {
    const currentTimeSnapshot = currentTime;
    
    // Lọc các tiến trình đã đến và còn thời gian xử lý
    const ready = remaining.filter((p) => p.arrival <= currentTimeSnapshot && p.remainingTime > 0);

    // Nếu không có tiến trình nào sẵn sàng, tăng currentTime
    if (ready.length === 0) {
      currentTime++;
      continue;
    }

    // Chọn tiến trình có thời gian còn lại (remainingTime) nhỏ nhất
    ready.sort((a, b) => a.remainingTime - b.remainingTime);
    const current = ready[0];

    // Nếu chưa có thời gian bắt đầu, gán giá trị startTime
    if (current.startTime === undefined) current.startTime = currentTime;

    // Giảm thời gian còn lại và cập nhật currentTime
    current.remainingTime -= 1;
    currentTime++;

    // Khi tiến trình hoàn thành
    if (current.remainingTime === 0) {
      current.completionTime = currentTime;
      current.turnaroundTime = currentTime - current.arrival;
      current.waitingTime = current.turnaroundTime - current.burst;

      // Thêm kết quả vào mảng result
      result.push({ ...current });
      completed++;
    }
  }

  // Sắp xếp kết quả theo id (hoặc pid)
  return result.sort((a, b) => a.pid.localeCompare(b.pid));
}
