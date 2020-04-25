import React, {CSSProperties, useEffect} from 'react';
import classes from './Grid.module.scss';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheckSquare, faEdit, faPlusSquare, faWindowClose} from '@fortawesome/free-solid-svg-icons';

type Column = { title: string; field: string; width?: string }

type GridProps<d extends dataType> = {
    columns: Column[];
    data: d[];
    id: string;
    editData?: { new: d; old: d };
    editRow: (data: d) => void;
    cancelEditRow: (data: d) => void;
    onChange: (field: string, value: string) => void;
    saveChanges: () => void;
    add: () => void;
}

type dataType = { Id?: string; [key: string]: string | undefined };

function Grid<d extends dataType>(props: GridProps<d>): JSX.Element {
    const {columns, data, editData, editRow, saveChanges, onChange, add, cancelEditRow} = props;
    useEffect(() => {
        if (editData && !editData.new.Id && !editData.old.Id) {
            window.scrollTo(0, document.body.scrollHeight);
        }
    }, [editRow]);

    function getRow(c: Column, data: d): JSX.Element {
        const cellStyle: CSSProperties = c.width ? {maxWidth: c.width, width: c.width} : {};
        if (editData && editData.old.Id === data.Id) {
            if (c.field === 'edit') {
                return (<td style={cellStyle}>
                    <div onClick={saveChanges} style={{float: 'left'}}><FontAwesomeIcon className='icon'
                                                                                        icon={faCheckSquare}/></div>
                    <div onClick={() => cancelEditRow(data)} style={{float: 'left'}}><FontAwesomeIcon className='icon'
                                                                                                      icon={faWindowClose}/>
                    </div>
                </td>);
            }
            return (
                <td key={c.field} style={cellStyle}>
                    <textarea rows={2} onChange={(e) => onChange(c.field, e.target.value)}
                              value={editData.new[c.field]}/>
                </td>);
        }
        if (!editData && c.field === 'edit') {
            return (
                <td style={cellStyle}>
                    <div onClick={() => editRow(data)}><FontAwesomeIcon className='icon' icon={faEdit}/></div>
                </td>);
        }
        return <td key={c.field} style={cellStyle}>{data[c.field]}</td>;
    }


    const header = columns.map(c => <th key={c.field} style={c.width ? {width: c.width} : {}}>{c.title}</th>);
    const rows = data.map(d => {
        return <tr key={d.Id}>{columns.map(c => getRow(c, d))}</tr>;
    });


    return (<>
        <FontAwesomeIcon onClick={add} style={{float: 'right'}} className='icon' icon={faPlusSquare}/>
        <table className={classes.blueTable}>
            <thead>
            <tr>
                {header}
            </tr>
            </thead>
            <tbody>
            {rows}
            </tbody>
        </table>
    </>);
}

export default Grid;
