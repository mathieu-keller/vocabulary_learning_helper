import React, {useMemo} from 'react';
import DeleteForeverOutlinedIcon from '@material-ui/icons/DeleteForeverOutlined';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import {Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@material-ui/core";

type Column = { title: string; field: string; width?: string }

type GridProps<d> = {
    columns: Column[];
    data: d[];
    id: string;
}


function Grid<d extends { edit?: boolean; data: { [key: string]: string } }>(props: GridProps<d>): JSX.Element {
    const {columns, data, id} = props;
    const columnsToRender = useMemo(() => columns.map((column => <TableCell
        key={column.field} style={column.width ? {width: column.width} : {}}>{column.title}</TableCell>)), [columns]);
    const dataToRender = useMemo(() =>
            data.map((d => {
                    if (d.edit) {
                        return (<tr key={d.data[id]}>
                            {columns.map(column => <TableCell key={column.field} style={column.width ? {width: column.width} : {}}>
                                <input name={column.field} type="text" className="form-control"
                                       value={d.data[column.field]}/>
                            </TableCell>)}
                        </tr>)
                    } else {
                        return (<tr key={d.data[id]}>
                            {columns.map(column => {
                                if (column.field === 'edit') {
                                    return (<TableCell key={column.field} style={column.width ? {width: column.width} : {}}>
                                        <Button color="primary">
                                            <EditOutlinedIcon/>
                                        </Button>
                                        <Button color="secondary">
                                            <DeleteForeverOutlinedIcon/>
                                        </Button>
                                    </TableCell>)
                                }
                                return (<TableCell key={column.field}
                                            style={column.width ? {width: column.width} : {}}>{d.data[column.field]}</TableCell>)
                            })}
                        </tr>)
                    }
                }
            ))
        , [columns, data]);
    return (
        <TableContainer component={Paper}>
        <Table>
            <TableHead>
                <TableRow>
                {columnsToRender}
                </TableRow>
            </TableHead>
            <TableBody>
            {dataToRender}
            </TableBody>
        </Table>
        </TableContainer>
    );
}

export default Grid;