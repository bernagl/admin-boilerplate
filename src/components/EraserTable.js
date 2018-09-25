import React from 'react'
import { Table, Thead, Tbody, Tr, Td } from 'react-super-responsive-table'
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css'

export default ({ title, cols, data, Render }) => {
  return (
    <div>
      {/* <h2 className="inline-block my-2">{title}</h2> */}
      {Render && (
        <span className="float-right">
          <Render />
        </span>
      )}
      <Table>
        <Thead>
          <Tr>
            {cols.map((col, i) => (
              <Td key={i}>{col.label}</Td>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {data.map((item, i) => (
            <Tr key={i}>
              {cols.map(({ Render, key }, j) => (
                <Td key={j}>{Render ? Render(item, i) : item[key]}</Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </div>
  )
}
