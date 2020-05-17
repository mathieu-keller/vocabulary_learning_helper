import React, {useEffect, useState} from 'react';
import {Paper} from "@material-ui/core";
import {get, post} from "../../utility/restCaller";
import CategoryEditModal from "../../components/ui/modal/CategoryEditModal";
import CardGrid from "../../components/ui/grid/CardGrid";
import {RouteComponentProps} from "react-router-dom";

export type Category = {
    id?: string;
    name: string;
    columns: string[];
}

const CategoryView = (props: RouteComponentProps): JSX.Element => {
    const emptyCategory = {name: '', columns: ["", ""]};
    const [categories, setCategories] = useState<Category[]>([]);
    const [editCategory, setEditCategory] = useState<Category>(emptyCategory);
    const [showModal, setShowModal] = useState<boolean>(false);
    useEffect(() => {
        get<Category[]>('/category', data => {
            setCategories(data);
        });
    }, []);

    const onChange = (field: string, value: string): void => {
        if (field === 'name') {
            setEditCategory({...editCategory, name: value});
        } else {
            const columnsCopy = [...editCategory.columns];
            columnsCopy[+field] = value;
            setEditCategory({...editCategory, columns: columnsCopy});
        }
    };

    const onClose = (): void => {
        setEditCategory(emptyCategory);
        setShowModal(false);
    };

    const onSave = (): void => {
        post<Category, Category>('/category', editCategory, data => {
            setCategories([...categories, data]);
            onClose();
        });
    };

    const addColumn = (): void => {
        setEditCategory({...editCategory, columns: [...editCategory.columns, ""]});
    };

    const onClick = (id?: string): void => {
        if (id) {
            props.history.push(`/vocabulary/${id}`);
        }
    };

    return (<>
            <CategoryEditModal addColumn={addColumn} saveHandler={onSave} editData={editCategory}
                               cancelHandler={onClose}
                               onChangeHandler={onChange}
                               show={showModal}
                               modalClosed={onClose}/>
            <Paper>
                <CardGrid onClick={onClick} title='Choose Category:' cards={categories}
                          addAction={() => setShowModal(true)}/>
            </Paper>
        </>
    );
};

export default CategoryView;