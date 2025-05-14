// components/Results.jsx
import React from 'react';

export default function Results({ result }) {
  return (
    <>
      <h3>Kết quả</h3>
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>PID</th>
            <th>AT</th>
            <th>BT</th>
            <th>CT</th>
            <th>TAT</th>
            <th>WT</th>
          </tr>
        </thead>
        <tbody>
          {result.map((p, i) => (
            <tr key={i}>
              <td>{p.pid}</td>
              <td>{p.arrival}</td>
              <td>{p.burst}</td>
              <td>{p.completionTime}</td>
              <td>{p.turnaroundTime}</td>
              <td>{p.waitingTime}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
