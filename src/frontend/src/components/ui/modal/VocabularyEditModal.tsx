import React from 'react';
import ModalWindow, {ModalWindowProps} from "./ModalWindow";
import {Vocab} from "../../../containers/vocabulary/VocabularyView";
import {Button} from "@material-ui/core";
import Creatable from "../input/Creatable";

type VocabularyEditModalProps = {
    saveHandler: () => void;
    editData: Vocab;
    cancelHandler: () => void;
    onChangeHandler: (field: string, value: string[]) => void;
} & ModalWindowProps;

const VocabularyEditModal = ({show, modalClosed, editData, saveHandler, cancelHandler, onChangeHandler}: VocabularyEditModalProps): JSX.Element => {
    const save = (): void => {
        saveHandler();
    };

    const onKeyDownHandler = (e: React.KeyboardEvent<HTMLElement>): void => {
        if (e.keyCode === 13) {
            save();
        }
    };

    const TextFields = editData.values.map((value) => (
        <div key={value.key}>
            <p>{value.key}</p>
            <Creatable
                onChange={(v) => onChangeHandler(value.key, v)}
                values={value.values}
                placeholder={value.key}
                onKeyDown={onKeyDownHandler}
            />
        </div>
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
