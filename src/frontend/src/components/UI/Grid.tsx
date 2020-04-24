import React from 'react';
import '../../../public/App.css'

type Column = { title: string; field: string; width?: string }

type GridProps<d> = {
    columns: Column[];
    data: d[];
    id: string;
    editData?: { new: d; old: d };
    editRow: (data?: d) => void;
    onChange: (field: string, value: string) => void;
    saveChanges: () => void;
}


function Grid<d extends { Id: string; [key: string]: string }>(props: GridProps<d>): JSX.Element {
    const {columns, data, editData, editRow, saveChanges, onChange} = props;
    const header = columns.map(c => <th key={c.field}>{c.title}</th>);
    const rows = data.map(d => {
        return <tr key={d.Id}>{columns.map(c => {
            if (editData && editData.old.Id === d.Id) {
                if (c.field === 'edit') {
                    return <td><p onClick={saveChanges}>save</p><p onClick={() => editRow(undefined)}>cancel</p></td>
                }
                return <td key={c.field}><input type='text' onChange={(e) => onChange(c.field, e.target.value)}
                                                value={editData.new[c.field]}/></td>
            }
            if (c.field === 'edit') {
                return <td><p onClick={() => editRow(d)}>edit</p></td>
            }
            return <td key={c.field}>{d[c.field]}</td>
        })}</tr>
    })
    return (
        <table className="blueTable">
            <thead>
            <tr>
                {header}
            </tr>
            </thead>
            <tbody>
            {rows}
            </tbody>
        </table>)
}

export default Grid;