import React from 'react';
import ModalWindow, {ModalWindowProps} from "./ModalWindow";
import {CancelButton, Input, SubmitButton} from "../Input";
import {Vocab} from "../../../containers/vocabulary/VocabularyView";

type VocabularyEditModalProps = {
    saveHandler: () => void;
    editData?: { new: Vocab; old: Vocab };
    cancelHandler: () => void;
    onChangeHandler: (field: string, value: string) => void;
} & ModalWindowProps;

const VocabularyEditModal = ({show, modalClosed, editData, saveHandler, cancelHandler, onChangeHandler}: VocabularyEditModalProps): JSX.Element => {
    const onKeyDownHandler = (e: React.KeyboardEvent<HTMLInputElement>): void => {
        {
            if (e.keyCode === 13) {
                saveHandler();
            }
        }
    };
    return (<ModalWindow modalClosed={modalClosed} show={show}>
            <Input type='text' name='german' title='German' placeholder='German' value={editData?.new.german}
                   onKeyDown={onKeyDownHandler} onChange={(e) => onChangeHandler(e.target.name, e.target.value)}/>
            <Input type='text' name='japanese' title='Japanese' placeholder='Japanese' value={editData?.new.japanese}
                   onKeyDown={onKeyDownHandler} onChange={(e) => onChangeHandler(e.target.name, e.target.value)}/>
            <Input type='text' name='kanji' title='Kanji' placeholder='Kanji' value={editData?.new.kanji}
                   onKeyDown={onKeyDownHandler} onChange={(e) => onChangeHandler(e.target.name, e.target.value)}/>
            <CancelButton style={{width: '50%', height: '30px'}} onClick={cancelHandler}/>
            <SubmitButton style={{width: '50%', height: '30px'}} onClick={saveHandler}/>
        </ModalWindow>
    );
};

export default VocabularyEditModal;
