import React, {CSSProperties, useEffect} from 'react';
import classes from './Grid.module.scss';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheckSquare, faEdit, faPlusSquare, faTrashAlt, faWindowClose} from '@fortawesome/free-solid-svg-icons';

type Column = { title: string; field: string; width?: string }

type GridProps<d extends dataType> = {
    columns: Column[];
    data: d[];
    id: string;
    editData?: { new: d; old: d };
    setEditHander: (data: d) => void;
    cancelHandler: (data: d) => void;
    onChangeHandler: (field: string, value: string) => void;
    saveHandler: () => void;
    addRowHandler: () => void;
    deleteHandler: (data: d) => void;
}

type dataType = { Id?: string; [key: string]: string | undefined };

function Grid<d extends dataType>(props: GridProps<d>): JSX.Element {
    const {columns, data, editData, cancelHandler, saveHandler, onChangeHandler, addRowHandler, setEditHander, deleteHandler} = props;
    useEffect(() => {
        if (editData && !editData.new.Id && !editData.old.Id) {
            window.scrollTo(0, document.body.scrollHeight);
        }
    }, [editData]);

    function getRow(c: Column, data: d): JSX.Element {
        const cellStyle: CSSProperties = c.width ? {maxWidth: c.width, width: c.width} : {};
        if (editData && editData.old.Id === data.Id) {
            if (c.field === 'edit') {
                return (<td style={cellStyle}>
                    <div onClick={saveHandler} style={{float: 'left'}}><FontAwesomeIcon className='icon'
                                                                                        icon={faCheckSquare}/></div>
                    <div onClick={() => cancelHandler(data)} style={{float: 'left'}}><FontAwesomeIcon className='icon'
                                                                                                      icon={faWindowClose}/>
                    </div>
                </td>);
            }
            return (
                <td key={c.field} style={cellStyle}>
                    <textarea rows={2} onChange={(e) => onChangeHandler(c.field, e.target.value)}
                              value={editData.new[c.field]}/>
                </td>);
        }
        if (!editData && c.field === 'edit') {
            return (
                <td style={cellStyle}>
                    <div style={{float: 'left'}} onClick={() => setEditHander(data)}><FontAwesomeIcon className='icon'
                                                                                                      icon={faEdit}/>
                    </div>
                    <div style={{float: 'left'}} onClick={() => deleteHandler(data)}><FontAwesomeIcon className='icon'
                                                                                                      icon={faTrashAlt}/>
                    </div>
                </td>);
        }
        return <td key={c.field} style={cellStyle}>{data[c.field]}</td>;
    }


    const header = columns.map(c => <th key={c.field} style={c.width ? {width: c.width} : {}}>{c.title}</th>);
    const rows = data.map(d => {
        return <tr key={d.Id}>{columns.map(c => getRow(c, d))}</tr>;
    });


    return (<>
        <FontAwesomeIcon onClick={addRowHandler} style={{float: 'right'}} className='icon' icon={faPlusSquare}/>
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
