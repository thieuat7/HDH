// src/components/GanttChart.jsx
import React from "react";
import "../style/GanttChart.css";

export default function GanttChart({ ganttChart }) {
  if (!ganttChart || ganttChart.length === 0) return <div></div>;

  //const totalTime = Math.max(...ganttChart.map(g => g.end));
  const scaleFactor = 1000;

  return (
    <div className="gantt-container">
      <h2 className="gantt-title">Gantt Chart</h2>

      <div className="gantt-bar-wrapper">
        {ganttChart.map((item, index) => {
          const width = (item.end - item.start) * scaleFactor;
          return (
            <div
              key={index}
              className="gantt-bar"
              style={{ width: `${width}px` }}
            >
              {item.pid}
            </div>
          );
        })}
      </div>

      <div className="gantt-timeline">
        {ganttChart.map((item, index) => (
          <div
            key={index}
            style={{ width: `${(item.end - item.start) * scaleFactor}px` }}
          >
            {item.start}
          </div>
        ))}
        <div>{ganttChart[ganttChart.length - 1].end}</div>
      </div>
    </div>
  );
}
