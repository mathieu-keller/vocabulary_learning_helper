import React from 'react';
import {Card, CardActionArea, CardContent, Grid, Typography} from "@material-ui/core";
import {Add} from "@material-ui/icons";

type CardGridProps<c extends { id?: string; name: string }[]> = {
    title: string;
    cards: c;
    addAction: () => void;
    onClick: (id: string) => void;
}

function CardGrid<c extends { id?: string; name: string }[]>(props: CardGridProps<c>): JSX.Element {
    const cards = props.cards.map(card => (
        <Grid key={card.id} item xs={4}>
            <Card>
                <CardActionArea onClick={() => props.onClick(card.id)}>
                    <CardContent>
                        <Typography align={"center"} variant="h4" component="h2">
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
            <Grid container style={{width: '100%', margin: '0'}} spacing={1} direction="row"
                  justify="flex-start"
                  alignItems="stretch">
                {cards}
                <Grid item xs={4}>
                    <Card>
                        <CardActionArea onClick={props.addAction}>
                            <CardContent>
                                <Typography align={"center"} variant="h4" component="h2">
                                    <Add/>
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
