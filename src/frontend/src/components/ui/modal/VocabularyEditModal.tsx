import React, {useRef} from 'react';
import ModalWindow, {ModalWindowProps} from "./ModalWindow";
import {Vocab} from "../../../containers/vocabulary/VocabularyView";
import {Button, TextField} from "@material-ui/core";

type VocabularyEditModalProps = {
    saveHandler: () => void;
    editData: Vocab;
    cancelHandler: () => void;
    onChangeHandler: (field: string, value: string) => void;
} & ModalWindowProps;

const VocabularyEditModal = ({show, modalClosed, editData, saveHandler, cancelHandler, onChangeHandler}: VocabularyEditModalProps): JSX.Element => {
    const firstInput = useRef<HTMLInputElement>(null);
    const save = (): void => {
        saveHandler();
        if (firstInput.current) {
            firstInput.current.focus();
        }
    };

    const onKeyDownHandler = (e: React.KeyboardEvent<HTMLInputElement>): void => {
        if (e.keyCode === 13) {
            save();
        }
    };

    return (<ModalWindow modalClosed={modalClosed} show={show}>
            <TextField inputRef={firstInput} id="german" label="German" variant="filled" value={editData.german}
                       style={{width: '100%'}}
                       onKeyDown={onKeyDownHandler} onChange={(e) => onChangeHandler('german', e.target.value)}
                       InputLabelProps={{
                           shrink: true,
                       }}
            />
            <TextField id="japanese" label="Japanese" variant="filled" value={editData.japanese}
                       style={{width: '100%'}}
                       onKeyDown={onKeyDownHandler} onChange={(e) => onChangeHandler('japanese', e.target.value)}
                       InputLabelProps={{
                           shrink: true,
                       }}/>
            <TextField id="kanji" label="Kanji" variant="filled" value={editData.kanji} style={{width: '100%'}}
                       onKeyDown={onKeyDownHandler} onChange={(e) => onChangeHandler('kanji', e.target.value)}
                       InputLabelProps={{
                           shrink: true,
                       }}/>
            <div style={{float: 'right'}}>
                <Button variant="contained" onClick={cancelHandler}>Cancel</Button>
                <Button variant="contained" color="primary" onClick={save}> Save </Button>
            </div>
        </ModalWindow>
    );
};

export default VocabularyEditModal;
