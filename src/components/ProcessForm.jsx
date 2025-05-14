// src/components/ProcessForm.jsx
import React, { useState } from 'react';

const ProcessForm = ({ algorithm, addProcess, setQuantum }) => {
  const [pid, setPid] = useState('');
  const [arrival, setArrival] = useState('');
  const [burst, setBurst] = useState('');
  const [localQuantum, setLocalQuantum] = useState('');

  const handleAddProcess = () => {
    if (!pid || !arrival || !burst) {
      alert("Vui lòng nhập đầy đủ thông tin tiến trình!");
      return;
    }

    const newProcess = {
      pid,
      arrival: parseInt(arrival),
      burst: parseInt(burst)
    };

    addProcess(newProcess);
    setPid('');
    setArrival('');
    setBurst('');
  };

  const handleQuantumChange = (e) => {
    const q = e.target.value;
    setLocalQuantum(q);
    setQuantum(parseInt(q));
  };

  return (
    <div className="add-process-form">
      <h3>Thêm Tiến Trình</h3>
      <input
        type="text"
        placeholder="PID (P1, P2, ...)"
        value={pid}
        onChange={(e) => setPid(e.target.value)}
      />
      <input
        type="number"
        placeholder="Arrival Time"
        value={arrival}
        onChange={(e) => setArrival(e.target.value)}
      />
      <input
        type="number"
        placeholder="Burst Time"
        value={burst}
        onChange={(e) => setBurst(e.target.value)}
      />

      {algorithm === 'rr' && (
        <input
          type="number"
          placeholder="Quantum Time"
          value={localQuantum}
          onChange={handleQuantumChange}
        />
      )}

      <button className="btn-add-process" onClick={handleAddProcess}>
        ➕ Thêm tiến trình
      </button>
    </div>
  );
};

export default ProcessForm;
