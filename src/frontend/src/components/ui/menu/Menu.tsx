import React from 'react';
import {Button, Menu as MaterialMenu, MenuItem} from "@material-ui/core";
import classes from './Menu.module.scss';

type MenuProps = {
    buttonClassName: string;
    buttonContent: JSX.Element | string;
    menuItems: {
        onClick: () => void;
        content: JSX.Element;
    }[];
}

const Menu = (props: MenuProps): JSX.Element => {
    const [open, setOpen] = React.useState<boolean>(false);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleClick = (event: React.MouseEvent<HTMLElement>): void => {
        setAnchorEl(event.currentTarget);
        setOpen(true);
    };
    return (
        <>
            <Button className={props.buttonClassName} onClick={handleClick}>
                {props.buttonContent}
            </Button>
            <MaterialMenu
                anchorEl={anchorEl}
                elevation={0}
                getContentAnchorEl={null}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                keepMounted
                open={open}
                onClose={() => setOpen(false)}
            >
                {props.menuItems.map((menuItem, index) => (
                    <MenuItem key={index} className={classes.menuItem} onClick={() => {
                        menuItem.onClick();
                        setOpen(false);
                    }}>
                        {menuItem.content}
                    </MenuItem>
                ))}
            </MaterialMenu>
        </>
    );
};

export default Menu;