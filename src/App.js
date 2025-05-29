import { useState } from 'react';
import './App.css';
import ProcessForm from './components/ProcessForm';
import ProcessList from './components/ProcessList';
import Results from './components/Results';

import { fcfs } from './algorithms/fcfs';
import { sjf } from './algorithms/sjf';
import { srtf } from './algorithms/srtf';
import { rr } from './algorithms/rr';

import GanttChart from './components/Gantt';
import Metrics from './components/Metrics';


function App() {
  const [processes, setProcesses] = useState([]);
  const [result, setResult] = useState([]);

  const [gantt, setGantt] = useState ([])
  const [metrics, setMetrics] = useState ([])

  const [algorithm, setAlgorithm] = useState('fcfs');
  const [quantum, setQuantum] = useState(0);

  // Hàm thêm tiến trình vào danh sách
  const addProcess = (newProcess) => {
    setProcesses((prev) => [...prev, newProcess]);
    console.log (processes)
  };

  // Hàm xóa tiến trình khỏi danh sách
  const onDeleteProcess = (pid) => {
    setProcesses((prevProcesses) => prevProcesses.filter((p) => p.pid !== pid));
  };

  // Chạy mô phỏng
  const runSimulation = () => {
    if (processes.length === 0) {
      alert("Vui lòng thêm ít nhất một tiến trình.");
      return;
    }

    let result, ganttChart, metrics;

    switch (algorithm) {
      case 'fcfs':
        ({ result, ganttChart, metrics } = fcfs(processes));
        break;
      case 'sjf':
        ({ result, ganttChart, metrics } = sjf(processes));
        break;
      case 'srtf':
        ({ result, ganttChart, metrics } = srtf(processes));
        break;
      case 'rr':
        ({ result, ganttChart, metrics } = rr(processes, quantum));
        break;
      default:
        alert("Thuật toán không hợp lệ.");
        return;
    }
    setResult(result);
    setGantt(ganttChart);
    setMetrics (metrics)
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>CPU Scheduling Simulator
        <button onClick={() => window.location.reload()} style={{ marginLeft: '10px' }}>
          🔄
        </button>
      </h2>

      <select value={algorithm} onChange={e => setAlgorithm(e.target.value)}>
        <option value="fcfs">FCFS</option>
        <option value="sjf">SJF</option>
        <option value="srtf">SRTF</option>
        <option value="rr">RR</option>
      </select>

      <ProcessForm algorithm={algorithm} addProcess={addProcess} setQuantum={setQuantum} />
      <button onClick={runSimulation}>▶️ Chạy mô phỏng</button>

      {/* Truyền hàm onDeleteProcess vào ProcessList */}
      <ProcessList processes={processes} onDeleteProcess={onDeleteProcess} />
      <Results result={result} />   
      <GanttChart ganttChart={gantt} />
      <Metrics
               avgTurnaroundTime={metrics.avgTurnaroundTime}
              avgResponseTime={metrics.avgResponseTime}
              avgWaitingTime={metrics.avgWaitingTime}
      />

    </div>
  );
}

export default App;
