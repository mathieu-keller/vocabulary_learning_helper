import React, {useState} from 'react';

import CreatableSelect from 'react-select/creatable';
import {ActionMeta} from "react-select/src/types";

const components = {
    DropdownIndicator: null,
};

const createOption = (label: string): { readonly label: string; readonly value: string } => ({
    label,
    value: label,
});

type CreatableProps = {
    readonly values?: string[];
    readonly onChange: (values: string[]) => void;
    readonly placeholder?: string;
    readonly onKeyDown?: (event: React.KeyboardEvent<HTMLElement>) => void;
}

export default (props: CreatableProps): JSX.Element => {
    const [inputValue, setInputValue] = useState<string>('');
    const handleChange = (value: any, actionMeta: ActionMeta<{ label: string; value: string }>): void => {
        if (actionMeta.action === 'remove-value' && props.values) {
            const newValueList = props.values.filter(val => val !== actionMeta.removedValue?.value);
            props.onChange(newValueList);
            setInputValue('');
        } else if (actionMeta.action === 'clear') {
            props.onChange([]);
            setInputValue('');
        } else {
            setInputValue(value);
        }
    };
    const handleInputChange = (inputVal: string): void => {
        setInputValue(inputVal);
    };
    const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>): void => {
        if (!inputValue) return;
        switch (event.key) {
            case 'Enter':
            case 'Tab':
                const {values} = props;
                console.log({values, inputValue});
                if (!values || values.length === 0) {
                    props.onChange([inputValue]);
                } else if (!values.find(val => val === inputValue)) {
                    props.onChange([...values, inputValue]);
                }
                setInputValue('');
                event.preventDefault();
        }
        if (props.onKeyDown) {
            props.onKeyDown(event);
        }
    };
    return (
        <CreatableSelect
            components={components}
            inputValue={inputValue}
            isClearable
            isMulti
            menuIsOpen={false}
            onChange={handleChange}
            onInputChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={props.placeholder}
            value={props.values?.map(createOption)}
        />
    );
};
