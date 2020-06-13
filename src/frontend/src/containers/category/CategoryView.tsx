import React, {useState} from 'react';
import {Paper} from "@material-ui/core";
import {deleteCall, post} from "../../utility/restCaller";
import CategoryEditModal from "../../components/ui/modal/CategoryEditModal";
import CardGrid from "../../components/ui/grid/CardGrid";
import {RouteComponentProps} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {AppStore} from "../../store/store.types";
import {userActionFunctions} from "../../actions/user";

export type Category = {
    readonly id?: string;
    readonly name: string;
    readonly columns: string[];
    readonly owner: string;
}

const CategoryView = (props: RouteComponentProps): JSX.Element => {
    const emptyCategory = {name: '', columns: ['', ''], owner: ''};
    const [editCategory, setEditCategory] = useState<Category>(emptyCategory);
    const [showModal, setShowModal] = useState<boolean>(false);
    const categories = useSelector((store: AppStore) => store.user.categories);
    const dispatch = useDispatch();

    const onClose = (): void => {
        setEditCategory(emptyCategory);
        setShowModal(false);
    };

    const onSave = async (data: Category): Promise<void> => {
        post<Category, Category>('/category', data)
            .then(r => {
                if (typeof r !== 'string') {
                    dispatch(userActionFunctions.storeCategories([...categories, r]));
                    onClose();
                }
            });
    };

    const onClick = (data: Category): void => {
        const {pathname} = props.location;
        dispatch(userActionFunctions.setSelectedCategory(data));
        if (pathname !== '/category') {
            props.history.push(`${pathname}/${data.owner}/${data.name}`);
        }
    };

    const deleteHandler = (id?: string): void => {
        if (id) {
            deleteCall<null, string>(`/category/${id}`, null)
                .then(resId => dispatch(userActionFunctions.removeCategory(resId)));
        }
    };

    return (<>
            {showModal ? <CategoryEditModal
                saveHandler={onSave}
                editData={editCategory}
                cancelHandler={onClose}
                modalClosed={onClose}/> : null}
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
