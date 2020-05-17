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

    const TextFields = editData.values.map(value => (
        <TextField key={value.key}
                   inputRef={firstInput}
                   id={value.key}
                   label={value.key}
                   variant="filled"
                   value={value.value}
                   style={{width: '100%'}}
                   onKeyDown={onKeyDownHandler}
                   onChange={(e) => onChangeHandler(value.key, e.target.value)}
                   InputLabelProps={{
                       shrink: true,
                   }}
        />
    ));

    return (<ModalWindow modalClosed={modalClosed} show={show}>
            {TextFields}
            <div style={{float: 'right'}}>
                <Button variant="contained" onClick={cancelHandler}>Cancel</Button>
                <Button variant="contained" color="primary" onClick={save}> Save </Button>
            </div>
        </ModalWindow>
    );
};

export default VocabularyEditModal;
