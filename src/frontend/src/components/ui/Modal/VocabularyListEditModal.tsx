import React from 'react';
import ModalWindow, {ModalWindowProps} from "./ModalWindow";
import {Button, TextField} from "@material-ui/core";
import {VocabularyList} from "../../../containers/vocabulary/VocabularyListView";

type VocabularyEditModalProps = {
    saveHandler: () => void;
    editData: VocabularyList;
    cancelHandler: () => void;
    onChangeHandler: (field: string, value: string) => void;
} & ModalWindowProps;

const VocabularyListEditModal = ({show, modalClosed, editData, saveHandler, cancelHandler, onChangeHandler}: VocabularyEditModalProps): JSX.Element => {
    const onKeyDownHandler = (e: React.KeyboardEvent<HTMLInputElement>): void => {
        if (e.keyCode === 13) {
            saveHandler();
        }
    };

    return (<ModalWindow modalClosed={modalClosed} show={show}>
            <TextField id="name" label="Name" variant="filled" value={editData.name}
                       style={{width: '100%'}}
                       onKeyDown={onKeyDownHandler} onChange={(e) => onChangeHandler('name', e.target.value)}
                       InputLabelProps={{
                           shrink: true,
                       }}
            />
            <div style={{float: 'right'}}>
                <Button variant="contained" onClick={cancelHandler}>Cancel</Button>
                <Button variant="contained" color="primary" onClick={saveHandler}> Save </Button>
            </div>
        </ModalWindow>
    );
};

export default VocabularyListEditModal;
