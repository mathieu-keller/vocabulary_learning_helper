import React from 'react';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import {Button, Card, CardHeader, Checkbox, Divider, Grid, List, ListItem, ListItemIcon, ListItemText} from '@material-ui/core';

type ValueObj = { value: string; name: string };

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: '100%',
      margin: 'auto',
    },
    cardHeader: {
      padding: theme.spacing(1, 2),
    },
    list: {
      width: '100%',
      height: '100%',
      backgroundColor: theme.palette.background.paper,
      overflow: 'auto',
    },
    button: {
      margin: theme.spacing(0.5, 0),
    },
  }),
);

const not = (a: ValueObj[], b: ValueObj[]): ValueObj[] => {
  return a.filter((value) => b.indexOf(value) === -1);
};

const intersection = (a: ValueObj[], b: ValueObj[]): ValueObj[] => {
  return a.filter((value) => b.indexOf(value) !== -1);
};

const union = (a: ValueObj[], b: ValueObj[]): ValueObj[] => {
  return [...a, ...not(b, a)];
};

type TransferListProps = {
  checked: ValueObj[];
  setChecked: (value: ValueObj[]) => void;
  left: ValueObj[];
  setLeft: (value: ValueObj[]) => void;
  right: ValueObj[];
  setRight: (value: ValueObj[]) => void;
  leftTitle: string;
  rightTitle: string;
};

const TransferList = ({checked, setChecked, left, setLeft, right, setRight, leftTitle, rightTitle}: TransferListProps): JSX.Element => {

  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  const handleToggle = (value: ValueObj): void => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const numberOfChecked = (items: ValueObj[]): number => intersection(checked, items).length;

  const handleToggleAll = (items: ValueObj[]): void => {
    if (numberOfChecked(items) === items.length) {
      setChecked(not(checked, items));
    } else {
      setChecked(union(checked, items));
    }
  };

  const handleCheckedRight = (): void => {
    setRight(right.concat(leftChecked));
    setLeft(not(left, leftChecked));
    setChecked(not(checked, leftChecked));
  };

  const handleCheckedLeft = (): void => {
    setLeft(left.concat(rightChecked));
    setRight(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
  };
  const classes = useStyles();
  const customList = (title: React.ReactNode, items: ValueObj[]): JSX.Element => (
    <Card className={classes.root}>
      <CardHeader
        className={classes.cardHeader}
        avatar={
          <Checkbox
            onClick={() => handleToggleAll(items)}
            checked={numberOfChecked(items) === items.length && items.length !== 0}
            indeterminate={numberOfChecked(items) !== items.length && numberOfChecked(items) !== 0}
            disabled={items.length === 0}
            inputProps={{'aria-label': 'all items selected'}}
          />
        }
        title={title}
        subheader={`${numberOfChecked(items)}/${items.length} selected`}
      />
      <Divider/>
      <List dense component="div" role="list" className={classes.list}>
        {items.map((valueObj: ValueObj) => {
          const {value, name} = valueObj;
          const labelId = `transfer-list-all-item-${value}-label`;

          return (
            <ListItem key={value} role="listitem" button onClick={() => handleToggle(valueObj)}>
              <ListItemIcon>
                <Checkbox
                  checked={checked.indexOf(valueObj) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{'aria-labelledby': labelId}}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={name}/>
            </ListItem>
          );
        })}
        <ListItem/>
      </List>
    </Card>
  );

  return (
    <Grid container justify="flex-start" alignItems="stretch">
      <Grid item xs={5}>{customList(leftTitle, left)}</Grid>
      <Grid item xs={2}>
        <div style={{
          display: 'flex',
          height: '100%',
          width: '80%',
          margin: 'auto',
          justifyContent: 'center',
          flexDirection: 'column',
        }}>
          <Button
            variant="outlined"
            onClick={handleCheckedRight}
            disabled={leftChecked.length === 0}
            aria-label="move selected right"
          >
            &gt;
          </Button>
          <Button
            variant="outlined"
            onClick={handleCheckedLeft}
            disabled={rightChecked.length === 0}
            aria-label="move selected left"
          >
            &lt;
          </Button>
        </div>
      </Grid>
      <Grid item xs={5}>{customList(rightTitle, right)}</Grid>
    </Grid>
  );
};

export default TransferList;
