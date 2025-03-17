import React from "react";

const DataTable = ({ data }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Локация</th>
          <th>Значение</th>
          <th>Время</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr key={index}>
            <td>{row.topic}</td>
            <td>{row.value}</td>
            <td>{new Date(row.timestamp).toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DataTable;
