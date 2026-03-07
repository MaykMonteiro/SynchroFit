import React from "react";

export default function Table({ columns, rows }) {
  return (
    <div className="overflow-hidden rounded-md shadow-soft border border-black/10">
      <table className="w-full text-[11px]">
        <thead className="bg-sf-green text-sf-textBlack uppercase text-sm">
          <tr>
            {columns.map((c) => (
              <th key={c} className="text-left px-2 py-1 border-r border-black">
                {c}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="bg-white">
          {rows.map((r, idx) => (
            <tr key={idx} className="border-t border-black text-sm">
              {r.map((cell, i) => (
                <td key={i} className="px-2 py-1 border-r border-black">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}