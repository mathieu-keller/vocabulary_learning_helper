import React from 'react';
import {Button, Card, CardActions, CardContent, Typography} from "@material-ui/core";
import {Vocab} from "../../containers/vocabulary/VocabularyView";
import Creatable from "../ui/input/Creatable";

export type TestCardProps = {
    selectedVocabulary: Vocab;
    front: string;
    back: string;
    next: () => void;
    onChange: (vocab: Vocab, field: string, values: string[]) => void;
}

const TestCard = ({selectedVocabulary, next, onChange, front, back}: TestCardProps): JSX.Element => {
    const values = selectedVocabulary.values.find(value => value.key === back)?.values;
    return (
        <Card style={{width: '50%', margin: 'auto'}}>
            <CardContent>
                <Typography color="textSecondary" gutterBottom>
                    {front}
                </Typography>
                <Typography variant="h5" component="h2">
                    {selectedVocabulary.values.find(value => value.key === front)?.values?.join(', ')}
                </Typography>
                <Typography variant="body2" component="div">
                    <p>{back}</p>
                    <Creatable
                        onChange={(e) => onChange(selectedVocabulary, back, e)}
                        onKeyDown={(e) => e.keyCode === 13 ? next() : null}
                        values={values ? values : []}
                        placeholder={back}
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
