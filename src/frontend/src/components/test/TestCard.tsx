import React from 'react';
import {Button, Card, CardActions, CardContent, TextField, Typography} from "@material-ui/core";
import {Vocab} from "../../containers/vocabulary/VocabularyView";

export type TestCardProps = {
    selectedVocabulary: Vocab;
    front: string;
    back: string;
    next: () => void;
    onChange: (vocab: Vocab, field: string, value: string) => void;
}

const TestCard = ({selectedVocabulary, next, onChange, front, back}: TestCardProps): JSX.Element => {
    return (
        <Card style={{width: '50%', margin: 'auto'}}>
            <CardContent>
                <Typography color="textSecondary" gutterBottom>
                    {front}
                </Typography>
                <Typography variant="h5" component="h2">
                    {selectedVocabulary.values.find(value => value.key === front)?.value}
                </Typography>
                <Typography variant="body2" component="div">
                    <TextField label={back}
                               style={{width: '100%'}}
                               onChange={(e) => onChange(selectedVocabulary, back, e.target.value)}
                               onKeyDown={(e) => e.keyCode === 13 ? next() : null}
                               value={selectedVocabulary.values.find(value => value.key === back)?.value}
                    />
                </Typography>
            </CardContent>
            <CardActions>
                <Button onClick={next} style={{width: '100%'}} variant="contained" color="primary">Next</Button>
            </CardActions>
        </Card>
    );
};

export default TestCard;
