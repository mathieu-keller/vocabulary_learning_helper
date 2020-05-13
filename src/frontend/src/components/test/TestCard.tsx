import React from 'react';
import {Button, Card, CardActions, CardContent, TextField, Typography} from "@material-ui/core";
import {Vocab} from "../../containers/vocabulary/VocabularyView";

export type TestCardProps = {
    selectedVocabulary: Vocab;
    next: () => void;
    onChange: (vocab: Vocab, field: 'japanese' | 'german', value: string) => void;
}

const TestCard = ({selectedVocabulary, next, onChange}: TestCardProps) => {
    return (
        <Card style={{width: '50%', margin: 'auto'}}>
            <CardContent>
                <Typography color="textSecondary" gutterBottom>
                    German
                </Typography>
                <Typography variant="h5" component="h2">
                    {selectedVocabulary.german}
                </Typography>
                <Typography variant="body2" component="div">
                    <TextField label='Japanese'
                               style={{width: '100%'}}
                               onChange={(e) => onChange(selectedVocabulary, 'japanese', e.target.value)}
                               onKeyDown={(e) => e.keyCode === 13 ? next() : null}
                               value={selectedVocabulary.japanese}
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
