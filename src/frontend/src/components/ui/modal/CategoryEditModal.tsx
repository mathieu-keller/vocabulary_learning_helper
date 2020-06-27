import React from 'react';
import ModalWindow, {ModalWindowProps} from "./ModalWindow";
import {Button, IconButton, TextField} from "@material-ui/core";
import {Category} from "../../../containers/category/CategoryView";
import {Add} from "@material-ui/icons";
import {ErrorMessage, Formik} from "formik";
import {ErrorRenderer} from "../../../utility/FormikErrorRenderer";

type VocabularyEditModalProps = {
  saveHandler: (data: Category) => Promise<void>;
  editData: Category;
  cancelHandler: () => void;
} & ModalWindowProps;

const CategoryEditModal = ({modalClosed, editData, saveHandler, cancelHandler}: VocabularyEditModalProps): JSX.Element => {

  const validateForm = (values: Category): { name?: string, columns?: string[] } => {
    const errors: { name?: string, columns?: string[] } = {columns: []};
    if (values.name.trim() === '') {
      errors.name = 'Required';
    }
    values.columns.forEach((value, index) => {
      if (value.trim() === '' && errors.columns) {
        errors.columns[index] = 'Required';
      }
    });
    if (errors.columns?.length === 0) {
      delete errors.columns;
    }
    return errors;
  };
  const form = (<Formik<Category>
    initialValues={editData}
    validate={validateForm}
    onSubmit={(values, {setSubmitting}) => {
      setSubmitting(true);
      saveHandler({...editData, name: values.name, columns: values.columns}).finally(() => {
        setSubmitting(false);
      });
    }}
  >
    {(
      {
        values,
        handleChange,
        handleSubmit,
        isSubmitting,
        handleBlur,
        isValid,
        setValues,
      }
    ) => {
      return (
        <form onSubmit={handleSubmit}>
          <TextField
            id="name"
            name="name"
            label="Name"
            variant="filled"
            value={values.name}
            style={{width: '100%'}}
            onBlur={handleBlur}
            onChange={handleChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <ErrorMessage render={ErrorRenderer} name="name"/>
          {values.columns.map((column, index) => (
            <div key={index}>
              <TextField
                id={`column-${index}`}
                label={`Column ${index + 1}`}
                name={`columns.${index}`}
                variant="filled"
                value={column}
                style={{width: '100%'}}
                onBlur={handleBlur}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <ErrorMessage render={ErrorRenderer} name={`columns.${index}`}/>
            </div>
          ))}
          <IconButton onClick={() => setValues({...values, columns: [...values.columns, '']})}>
            <Add/>
          </IconButton>
          <div style={{float: 'right'}}>
            <Button variant="contained" onClick={cancelHandler}>Cancel</Button>
            <Button disabled={isSubmitting || !isValid} type="submit" variant="contained" color="primary"> Save </Button>
          </div>
        </form>
      );
    }}
  </Formik>);

  return (
    <ModalWindow modalClosed={modalClosed}>
      {form}
    </ModalWindow>
  );
};

export default React.memo(CategoryEditModal);
