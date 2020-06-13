import React from 'react';
import ModalWindow, {ModalWindowProps} from "./ModalWindow";
import {Button, TextField} from "@material-ui/core";
import {VocabularyList} from "../../../containers/vocabulary/VocabularyListView";
import {ErrorMessage, Formik} from "formik";
import {ErrorRenderer} from "../../../utility/FormikErrorRenderer";

type VocabularyEditModalProps = {
    saveHandler: (data: VocabularyList) => Promise<void>;
    editData: VocabularyList;
    cancelHandler: () => void;
} & ModalWindowProps;

const VocabularyListEditModal = ({modalClosed, editData, saveHandler, cancelHandler}: VocabularyEditModalProps): JSX.Element => {
    const validateForm = (values: VocabularyList): { name?: string } => {
        const errors: { name?: string } = {};
        if (!values.name || values.name.trim() === '') {
            errors.name = 'Required';
        }
        return errors;
    };

    const form = (<Formik<VocabularyList>
        initialValues={editData}
        validate={validateForm}
        onSubmit={(values, {setSubmitting}) => {
            setSubmitting(true);
            saveHandler({...editData, name: values.name}).finally(() => {
                setSubmitting(false);
            });
        }}
    >
        {({
              values,
              handleBlur,
              handleChange,
              handleSubmit,
              isSubmitting,
              isValid,
          }) => {
            return (
                <form onSubmit={handleSubmit}>
                    <TextField id="name" name="name" label="Name" variant="filled" value={values.name}
                               style={{width: '100%'}}
                               onBlur={handleBlur}
                               onChange={handleChange}
                               InputLabelProps={{
                                   shrink: true,
                               }}
                    />
                    <ErrorMessage render={ErrorRenderer} name="name"/>
                    <div style={{float: 'right'}}>
                        <Button variant="contained" onClick={cancelHandler}>Cancel</Button>
                        <Button disabled={isSubmitting || !isValid} type="submit" variant="contained" color="primary"> Save </Button>
                    </div>
                </form>
            );
        }}
    </Formik>);

    return (<ModalWindow modalClosed={modalClosed}>
            {form}
        </ModalWindow>
    );
};

export default VocabularyListEditModal;
