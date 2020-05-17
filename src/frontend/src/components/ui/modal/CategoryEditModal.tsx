import React from 'react';
import ModalWindow, {ModalWindowProps} from "./ModalWindow";
import {Button, IconButton, TextField} from "@material-ui/core";
import {Category} from "../../../containers/vocabulary/CategoryView";
import {Add} from "@material-ui/icons";

type VocabularyEditModalProps = {
    saveHandler: () => void;
    editData: Category;
    addColumn: () => void;
    cancelHandler: () => void;
    onChangeHandler: (field: string, value: string) => void;
} & ModalWindowProps;

const CategoryEditModal = ({addColumn,show, modalClosed, editData, saveHandler, cancelHandler, onChangeHandler}: VocabularyEditModalProps): JSX.Element => {
    const onKeyDownHandler = (e: React.KeyboardEvent<HTMLInputElement>): void => {
        if (e.keyCode === 13) {
            saveHandler();
        }
    };

    const textFields = editData.columns.map((column, index) => (
        <TextField key={index}
                   id={`column-${index}`}
                   label={`Column ${index + 1}`}
                   variant="filled"
                   value={column}
                   style={{width: '100%'}}
                   onKeyDown={onKeyDownHandler}
                   onChange={(e) => onChangeHandler(index + '', e.target.value)}
                   InputLabelProps={{
                       shrink: true,
                   }}
        />
    ));

    return (<ModalWindow modalClosed={modalClosed} show={show}>
            <TextField id="name" label="Name" variant="filled" value={editData.name}
                       style={{width: '100%'}}
                       onKeyDown={onKeyDownHandler} onChange={(e) => onChangeHandler('name', e.target.value)}
                       InputLabelProps={{
                           shrink: true,
                       }}
            />
            {textFields}
            <IconButton onClick={addColumn}>
                <Add/>
            </IconButton>
            <div style={{float: 'right'}}>
                <Button variant="contained" onClick={cancelHandler}>Cancel</Button>
                <Button variant="contained" color="primary" onClick={saveHandler}> Save </Button>
            </div>
        </ModalWindow>
    );
};

export default React.memo(CategoryEditModal);
