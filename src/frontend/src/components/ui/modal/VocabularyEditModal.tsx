import React from 'react';
import ModalWindow, {ModalWindowProps} from "./ModalWindow";
import {Vocab, VocabularyValue} from "../../../containers/vocabulary/VocabularyView";
import Creatable from "../input/Creatable";
import {ErrorMessage, Formik} from "formik";
import {Button} from "@material-ui/core";
import {ErrorRenderer} from "../../../utility/FormikErrorRenderer";

type VocabularyEditModalProps = {
    saveHandler: (data: Vocab) => Promise<void>;
    editData: Vocab;
    cancelHandler: () => void;
} & ModalWindowProps;

const VocabularyEditModal = ({show, modalClosed, editData, saveHandler, cancelHandler}: VocabularyEditModalProps): JSX.Element => {
    const validateForm = (values: VocabularyValue[]): { [key: string]: string } => {
        const errors: { [key: string]: string } = {};
        values.forEach(value => {
            if (!value.values || value.values.length <= 0) {
                errors[value.key] = 'Required';
            }
        });
        return errors;
    };
    const form = editData.values.length > 0 ?
        (<Formik<VocabularyValue[]>
            initialValues={editData.values}
            validate={validateForm}
            onSubmit={(values, {setSubmitting, setValues}) => {
                setSubmitting(true);
                saveHandler({...editData, values: values}).finally(() => {
                    setSubmitting(false);
                    setValues(values.map(value => ({...value, values: []})));
                });
            }}
        >
            {({
                  values,
                  setFieldTouched,
                  handleSubmit,
                  isSubmitting,
                  setFieldValue,
                  isValid
              }) => {
                return (
                    <form onSubmit={handleSubmit}>
                        <div>
                            {values.map((value, index) => (
                                <div key={value.key}>
                                    <p>{value.key}</p>
                                    <Creatable
                                        onBlur={() => setFieldTouched(value.key)}
                                        onChange={(v) => setFieldValue(`${index}.values`, v)}
                                        values={value.values}
                                        placeholder={value.key}
                                    />
                                    <ErrorMessage render={ErrorRenderer} name={value.key}/>
                                </div>
                            ))}
                        </div>
                        <div style={{float: 'right'}}>
                            <Button variant="contained" onClick={cancelHandler}>Cancel</Button>
                            <Button disabled={isSubmitting || !isValid} type="submit" variant="contained" color="primary"> Save </Button>
                        </div>
                    </form>
                );
            }}
        </Formik>) : null;
    return (<ModalWindow modalClosed={modalClosed} show={show}>
            {form}
        </ModalWindow>
    );
};

export default VocabularyEditModal;
