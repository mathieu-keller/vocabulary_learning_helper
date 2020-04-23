import React, {useMemo} from 'react';
import {Table} from 'react-bootstrap';

type Column = { title: string; field: string }

type GridProps<d> = {
    columns: Column[];
    data: d[];
}


function Grid<d extends { Id: string; [key: string]: string }>(props: GridProps<d>): JSX.Element {
    const {columns, data} = props;
    const columnsToRender = useMemo(() => columns.map((column => <th
        key={column.field}>{column.title}</th>)), [columns]);
    const dataToRender = useMemo(() =>
            data.map((d =>
                    <tr key={d.Id}>
                        {columns.map(column => <td key={column.field}>{d[column.field]}</td>)}
                    </tr>
            ))
        , [columns, data]);
    return (
        <Table striped bordered hover>
            <thead>
            <tr>
                {columnsToRender}
            </tr>
            </thead>
            <tbody>
            {dataToRender}
            </tbody>
        </Table>
    );
}

export default Grid;