import React from 'react';
import '../style/ProcessList.css'; // Import CSS file for styling

const ProcessList = ({ processes, onDeleteProcess }) => {
  const handleDelete = (pid) => {
    // Gọi hàm onDeleteProcess và truyền pid của tiến trình cần xóa
    onDeleteProcess(pid);
  };

  return (
    <div className="process-list">
      <h3>Danh sách tiến trình</h3>
      <ul>
        {processes.map(p => (
          <li key={p.pid}>
            {p.pid}: AT={p.arrival}, BT={p.burst}
            <button onClick={() => handleDelete(p.pid)}>Xóa</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProcessList;
