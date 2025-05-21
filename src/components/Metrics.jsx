import React from 'react';
import '../style/Metrics.css';  // import file CSS bình thường

const Metrics = ({ avgTurnaroundTime, avgWaitingTime, avgResponseTime }) => {
  return (
    <div className="metrics-container">
      <h3 className="title">Metrics</h3>
      <ul className="metrics-list">
        <li>
          <span className="label">Average Turnaround Time:</span>
          <span className="value">{avgTurnaroundTime}</span>
        </li>
        <li>
          <span className="label">Average Waiting Time:</span>
          <span className="value">{avgWaitingTime}</span>
        </li>
        <li>
          <span className="label">Average Response Time:</span>
          <span className="value">{avgResponseTime}</span>
        </li>
      </ul>
    </div>
  );
};

export default Metrics;
