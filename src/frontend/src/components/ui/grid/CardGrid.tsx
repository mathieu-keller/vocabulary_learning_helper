import React from 'react';
import {Button, Card, CardActionArea, CardActions, CardContent, Grid, Typography} from "@material-ui/core";
import {Add, DeleteForeverOutlined, EditOutlined} from "@material-ui/icons";

type CardGridProps<c extends { id?: string; name: string }> = {
    title: string;
    cards: c[];
    addAction: () => void;
    onClick: (id?: string) => void;
    deleteHandler: (id?: string) => void;
    setEditHandler: (data: c) => void;
}

function CardGrid<c extends { id?: string; name: string }>(props: CardGridProps<c>): JSX.Element {
    const cards = props.cards.map(card => (
        <Grid key={card.id} item xs={4}>
            <Card>
                <CardContent>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => props.onClick(card.id)}
                        style={{width: '100%', textTransform: 'none'}}>
                        <Typography align={"center"} variant="h4" component="h2">
                            {card.name}
                        </Typography>
                    </Button>
                </CardContent>
                <CardActions>
                    <Button
                        variant="contained"
                        color="secondary"
                        style={{width: '50%'}}
                        onClick={() => props.deleteHandler(card.id)}>
                        <DeleteForeverOutlined/>
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        style={{width: '50%'}}
                        onClick={() => props.setEditHandler(card)}>
                        <EditOutlined/>
                    </Button>
                </CardActions>
            </Card>
        </Grid>
    ));

    return (<>
            <h1>{props.title}</h1>
            <hr/>
            <Grid container style={{width: '100%', margin: '0'}} spacing={1} direction="row"
                  justify="flex-start"
                  alignItems="stretch">
                {cards}
                <Grid item xs={4}>
                    <Card style={{height: '100%'}}>
                        <CardActionArea style={{height: '100%'}} onClick={props.addAction}>
                            <CardContent>
                                <Typography align={"center"} variant="h4" component="h2">
                                    <Add style={{fontSize: '64px'}}/>
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </Grid>
            </Grid>
        </>
    );
}

export default React.memo(CardGrid);
