import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

export default function table(topPlayer) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 200 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>
              <strong>Top</strong>
            </TableCell>
            <TableCell>
              <strong>Name</strong>
            </TableCell>
            <TableCell>
              <strong>Money</strong>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {topPlayer.length > 0 ? (
            topPlayer.map((row, index) => (
              <TableRow
                key={row.name}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th">{index + 1}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.price}</TableCell>
              </TableRow>
            ))
          ) : (
            <tr className="message-player">
              <td colSpan={3}>Top player not found.</td>
            </tr>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
