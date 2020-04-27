import React, {CSSProperties, useEffect} from 'react';
import classes from './Grid.module.scss';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit, faPlusSquare, faTrashAlt} from '@fortawesome/free-solid-svg-icons';

type Column = { title: string; field: string; width?: string }

type GridProps<d extends dataType> = {
    columns: Column[];
    data: d[];
    id: string;
    editData?: { new: d; old: d };
    setEditHandler: (data: d) => void;
    addRowHandler: () => void;
    deleteHandler: (data: d) => void;
}

type dataType = { Id?: string; [key: string]: string | undefined };

function Grid<d extends dataType>(props: GridProps<d>): JSX.Element {
    const {editData} = props;
    useEffect(() => {
        if (editData && !editData.new.Id && !editData.old.Id) {
            window.scrollTo(0, document.body.scrollHeight);
        }
    }, [editData]);

    const sortData = (data: d[]): d[] => {
        return data.sort((da, db) => {
            if (da.Id && db.Id) {
                if (da.Id < db.Id)
                    return -1;
                if (da.Id > db.Id)
                    return 1;
            }
            return 0;
        });
    };

    function getRow(c: Column, data: d): JSX.Element {
        const cellStyle: CSSProperties = c.width ? {maxWidth: c.width, width: c.width} : {};
        let row: JSX.Element;
        if (c.field === 'edit') {
            const {deleteHandler, setEditHandler} = props;
            row = <>
                <div style={{float: 'left'}} onClick={() => setEditHandler(data)}>
                    <FontAwesomeIcon aria-label='edit entry' title='edit entry' className='icon' icon={faEdit}/>
                </div>
                <div style={{float: 'left'}} onClick={() => deleteHandler(data)}>
                    <FontAwesomeIcon aria-label='delete entry' title='delete entry' className='icon' icon={faTrashAlt}/>
                </div>
            </>;
        } else {
            row = <>{data[c.field]}</>;
        }
        return <div className={classes.cell} key={c.field} style={cellStyle}>{row}</div>;
    }

    const {addRowHandler, columns, data} = props;
    const header = columns.map(c => <div className={classes.head} key={c.field}
                                         style={c.width ? {maxWidth: c.width, width: c.width} : {}}>{c.title}</div>);
    const rows = sortData(data).map((d, i) => {
        return <div className={classes.row} key={d.Id ?? i}>{columns.map(c => getRow(c, d))}</div>;
    });

    return (<>
        <FontAwesomeIcon aria-label='add entry' title='add entry' onClick={addRowHandler} style={{float: 'right'}}
                         className='icon' icon={faPlusSquare}/>
        <div className={classes.table}>
            <div className={classes.heading}>
                <div className={classes.row}>
                    {header}
                </div>
            </div>
            <div className={classes.body}>
                {rows}
            </div>
        </div>
    </>);
}

export default Grid;
