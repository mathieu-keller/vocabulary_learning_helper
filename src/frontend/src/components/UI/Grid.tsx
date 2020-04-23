import React from 'react';
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";

type Column = { name: string; field: string }

type GridProps<d> = {
    columns: Column[];
    data: d[];
}

const useStyles = makeStyles({
    root: {
        width: '100%',
    },
    container: {
        maxHeight: 440,
    },
});

function Grid<d extends { Id: string; [key: string]: string }>(props: GridProps<d>): JSX.Element {
    const {columns, data} = props;
    const classes = useStyles();
    return (
        <Paper className={classes.root}>
            <TableContainer className={classes.container}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell key={column.field}>
                                    {column.name}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((row) =>
                            <TableRow hover role="checkbox" key={row.id}>
                                {columns.map((column) =>
                                    <TableCell key={column.field}>
                                        {row[column.field]}
                                    </TableCell>
                                )}
                            </TableRow>)}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
}

export default Grid;