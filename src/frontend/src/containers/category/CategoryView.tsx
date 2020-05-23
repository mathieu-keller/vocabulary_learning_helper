import React, {useState} from 'react';
import {Paper} from "@material-ui/core";
import {deleteCall, post} from "../../utility/restCaller";
import CategoryEditModal from "../../components/ui/modal/CategoryEditModal";
import CardGrid from "../../components/ui/grid/CardGrid";
import {RouteComponentProps} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {AppStore} from "../../store/store.types";
import {setSelectedCategory, storeCategories} from "../../actions/user";

export type Category = {
    id?: string;
    name: string;
    columns: string[];
    owner: string;
}

const CategoryView = (props: RouteComponentProps): JSX.Element => {
    const emptyCategory = {name: '', columns: ['', ''], owner: ''};
    const [editCategory, setEditCategory] = useState<Category>(emptyCategory);
    const [showModal, setShowModal] = useState<boolean>(false);
    const categories = useSelector((store: AppStore) => store.user.categories);
    const dispatch = useDispatch();

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
            dispatch(storeCategories([...categories, data]));
            onClose();
        });
    };

    const addColumn = (): void => {
        setEditCategory({...editCategory, columns: [...editCategory.columns, ""]});
    };

    const onClick = (data: Category): void => {
        const {pathname} = props.location;
        dispatch(setSelectedCategory(data));
        if(pathname !== '/category') {
            props.history.push(`${pathname}/${data.owner}/${data.name}`);
        }
    };

    const deleteHandler = (id?: string): void => {
        if (id) {
            deleteCall<{}, string>(`/category/${id}`, {},
                (resId) => dispatch(storeCategories(categories.filter(category => category.id !== resId))));
        }
    };

    return (<>
            <CategoryEditModal
                addColumn={addColumn}
                saveHandler={onSave}
                editData={editCategory}
                cancelHandler={onClose}
                onChangeHandler={onChange}
                show={showModal}
                modalClosed={onClose}/>
            <Paper>
                <CardGrid<Category>
                    deleteHandler={deleteHandler}
                    onClick={onClick}
                    title='Choose Category:'
                    cards={categories}
                    addAction={() => setShowModal(true)}
                    setEditHandler={(d: Category) => console.log(d)}/>
            </Paper>
        </>
    );
};

export default CategoryView;
