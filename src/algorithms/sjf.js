export function sjf(processes) {
  let currentTime = 0;
  const result = processes
    .slice()
    .sort((a, b) => a.arrival - b.arrival) // Sắp xếp theo arrival time
    .map((p) => {
      // Thêm các tiến trình đến trước currentTime vào hàng đợi
      const startTime = Math.max(currentTime, p.arrival); // Tiến trình bắt đầu khi currentTime hoặc khi nó đến
      const completionTime = startTime + p.burst; // Tính thời gian hoàn thành
      const turnaroundTime = completionTime - p.arrival; // Thời gian quay vòng = completion - arrival
      const waitingTime = turnaroundTime - p.burst; // Thời gian chờ = turnaround - burst

      currentTime = completionTime; // Cập nhật currentTime sau khi tiến trình hoàn thành

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
