import React, {useEffect} from 'react';
import {AppBar, Tab, Tabs, Toolbar} from '@material-ui/core';
import {RouteComponentProps, withRouter} from 'react-router-dom';
import {AccountCircle, Home, School, Translate,Category as CategoryIcon} from "@material-ui/icons";
import classes from './NavigationBar.module.scss';
import {useDispatch, useSelector} from "react-redux";
import {AppStore} from "../../../store/store.types";
import {Category} from "../../../containers/category/CategoryView";
import {setSelectedCategory} from "../../../actions/user";
const NavigationBar = (props: { selectedCategory?: Category } & RouteComponentProps): JSX.Element => {
    const isLogin = useSelector((store: AppStore) => store.user.isLogin);
    const categories = useSelector((store: AppStore) => store.user.categories);
    const selectedCategory = useSelector((store: AppStore) => store.user.selectedCategory);
    const pathSections = props.location.pathname.split('/');
    const [,section, urlUser, urlCategory] = pathSections;
    const dispatch = useDispatch();
    useEffect(() => {
        const user = selectedCategory.owner || urlUser;
        const category = selectedCategory.name || urlCategory;
        if (user && category && category !== selectedCategory.name.toLocaleLowerCase()) {
            const storedCategory = categories.find(c => c.owner.toLocaleLowerCase() === user.toLocaleLowerCase() &&
                c.name.toLocaleLowerCase() === category.toLocaleLowerCase());
            if (storedCategory) {
                dispatch(setSelectedCategory(storedCategory));
            }
        }
    }, [urlUser, urlCategory, selectedCategory, categories]);
    let tabs;
    if (isLogin) {
        const withoutCategory = ["/", "/profile", "/category"];
        tabs = (
            <Tabs className={classes.tabs} value={`/${section}`}
                  onChange={(e, v) => {
                      let url = v;
                      const user = selectedCategory.owner;
                      const category = selectedCategory.name;
                      if (withoutCategory.indexOf(v) === -1 && user && category) {
                          url += `/${user.toLocaleLowerCase()}/${category.toLocaleLowerCase()}`;
                      }
                      props.history.push(url);
                  }}>
                <Tab label="Home" icon={<Home/>} value={'/'}/>
                <Tab label="Vocabulary" icon={<Translate/>} value={'/vocabulary'}/>
                <Tab label="Learn" icon={<School/>} value={'/learn'}/>
                <Tab label={selectedCategory.name || 'Category'} icon={<CategoryIcon/>} value={`/category`}/>
                <Tab label="Profile" icon={<AccountCircle/>} value={'/profile'}/>
            </Tabs>
        );
    } else {
        tabs = (
            <Tabs className={classes.tabs} value={'/' + props.location.pathname.split('/', 2)[1]}
                  onChange={(e, v) => props.history.push(v)}>
                <Tab label="Home" icon={<Home/>} value={'/'}/>
                <Tab label="Login" icon={<AccountCircle/>} value={'/login'}/>
            </Tabs>
        );
    }
    return (
        <AppBar position="static">
            <Toolbar>
                {tabs}
                <h1>{props.selectedCategory ? props.selectedCategory.name : ''}</h1>
            </Toolbar>
        </AppBar>
    );
};

export default withRouter(NavigationBar);
