import React from 'react';
import {Card, CardActionArea, CardContent, Grid, Typography} from "@material-ui/core";
import {Add, DeleteForeverOutlined, EditOutlined, Settings} from "@material-ui/icons";
import Menu from "../menu/Menu";
import classes from "./CardGrid.module.scss";

type CardGridProps<c extends { id?: string; name: string }> = {
    title: string;
    cards: c[];
    addAction: () => void;
    onClick: (id?: string) => void;
    deleteHandler: (id?: string) => void;
    setEditHandler: (data: c) => void;
}

function CardGrid<c extends { id?: string; name: string }>(props: CardGridProps<c>): JSX.Element {

    const getOptionBar = (card: c): JSX.Element => (
        <div className={classes.optionBar}>
            <Menu
                buttonContent={<Settings className={classes.optionIcon}/>}
                buttonClassName={classes.optionButton}
                menuItems={[
                    {onClick: () => props.setEditHandler(card), content: <EditOutlined className={classes.editIcon}/>},
                    {onClick: () => props.deleteHandler(card.id), content: <DeleteForeverOutlined className={classes.deleteIcon}/>}
                ]}/>
        </div>
    );
    const cards = props.cards.map(card => (
        <Grid item key={card.id} xs={4}>
            <Card className={classes.card}>
                {getOptionBar(card)}
                <CardActionArea onClick={() => props.onClick(card.id)}>
                    <CardContent>
                        <Typography className={classes.typography} align={"center"} variant="h4" component="h2">
                            {card.name}
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
        </Grid>
    ));

    return (<>
            <h1>{props.title}</h1>
            <hr/>
            <Grid
                container
                className={classes.gridContainer}
                spacing={1}
                direction="row"
                justify="flex-start"
                alignItems="stretch"
            >
                {cards}
                <Grid item xs={4}>
                    <Card className={classes.card}>
                        <CardActionArea className={classes.actionArea} onClick={props.addAction}>
                            <CardContent>
                                <Typography className={classes.typography} align={"center"} variant="h4" component="h2">
                                    <Add className={classes.cardIcon}/>
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </Grid>
            </Grid>
        </>
    );
}

export default CardGrid;
