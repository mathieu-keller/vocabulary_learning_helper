import React, {useEffect} from 'react';
import {AppBar, Tab, Tabs, Toolbar} from '@material-ui/core';
import {RouteComponentProps, withRouter} from 'react-router-dom';
import {AccountCircle, Build, Category as CategoryIcon, Home, School, Translate} from "@material-ui/icons";
import classes from './NavigationBar.module.scss';
import {useDispatch, useSelector} from "react-redux";
import {userActionFunctions} from "../../../actions/user";
import {AppStore} from "../../../store/store.types";
import {Category} from "../../../containers/category/CategoryView";


// visible for test
export const NavigationBar = (props: RouteComponentProps): JSX.Element => {
  const isLogin = useSelector((store: AppStore): boolean => store.user.isLogin);
  const categories = useSelector((store: AppStore): Category[] => store.user.categories);
  const selectedCategory = useSelector((store: AppStore): Category => store.user.selectedCategory);
  const pathSections = props.location.pathname.split('/');
  const [, section, urlUser, urlCategory] = pathSections;
  const dispatch = useDispatch();
  useEffect(() => {
    const user = urlUser;
    const category = urlCategory;
    if (user && category && category.toLocaleLowerCase() !== selectedCategory.name.toLocaleLowerCase() &&
      user.toLocaleLowerCase() !== selectedCategory.owner.toLocaleLowerCase()) {
      const storedCategory = categories.find(c => c.owner.toLocaleLowerCase() === user.toLocaleLowerCase() &&
        c.name.toLocaleLowerCase() === category.toLocaleLowerCase());
      if (storedCategory) {
        dispatch(userActionFunctions.setSelectedCategory(storedCategory));
      }
    }
  }, [urlUser, urlCategory, selectedCategory, categories]);
  let tabs;
  if (isLogin) {
    const withoutCategory = ["/", "/profile", "/category", "/info"];
    tabs = (
      <Tabs
        data-testid="navigation-tabs-login"
        className={classes.tabs}
        value={`/${section}`}
        onChange={(e, v) => {
          let url = v;
          const user = selectedCategory.owner;
          const category = selectedCategory.name;
          if (withoutCategory.indexOf(v) === -1 && user && category) {
            url += `/${user.toLocaleLowerCase()}/${category.toLocaleLowerCase()}`;
          }
          props.history.push(url);
        }}
      >
        <Tab label="Home" icon={<Home/>} value={'/'}/>
        <Tab label="Vocabulary" icon={<Translate/>} value={'/vocabulary'}/>
        <Tab label="Learn" icon={<School/>} value={'/learn'}/>
        <Tab label={selectedCategory.name || 'Category'} icon={<CategoryIcon/>} value={`/category`}/>
        <Tab label="Profile" icon={<AccountCircle/>} value={'/profile'}/>
        <Tab label="Build Info" icon={<Build/>} value='/info'/>
      </Tabs>
    );
  } else {
    tabs = (
      <Tabs
        data-testid="navigation-tabs-logout"
        className={classes.tabs}
        value={'/' + props.location.pathname.split('/', 2)[1]}
        onChange={(e, v) => props.history.push(v)}
      >
        <Tab label="Home" icon={<Home/>} value={'/'}/>
        <Tab label="Login" icon={<AccountCircle/>} value={'/login'}/>
        <Tab label="Build Info" icon={<Build/>} value='/info'/>
      </Tabs>
    );
  }
  return (
    <AppBar position="static">
      <Toolbar>
        {tabs}
      </Toolbar>
    </AppBar>
  );
};

export default withRouter(NavigationBar);
