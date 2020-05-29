import React, {useState} from 'react';

import CreatableSelect from 'react-select/creatable';
import {ActionMeta, ValueType} from "react-select/src/types";

const components = {
    DropdownIndicator: null,
};

type CreatableValue = {
    readonly label: string;
    readonly value: string;
};

const createOption = (label: string): CreatableValue => ({
    label,
    value: label,
});

type CreatableProps = {
    readonly values: string[] | null;
    readonly onChange: (values: string[]) => void;
    readonly placeholder?: string;
    readonly onKeyDown?: (event: React.KeyboardEvent<HTMLElement>) => void;
}

export default (props: CreatableProps): JSX.Element => {
    const [inputValue, setInputValue] = useState<string>('');
    const handleChange = (value: ValueType<CreatableValue>, actionMeta: ActionMeta<CreatableValue>): void => {
        if (actionMeta.action === 'remove-value' && props.values) {
            const newValueList = props.values.filter(val => val !== actionMeta.removedValue?.value);
            props.onChange(newValueList);
            setInputValue('');
        } else if (actionMeta.action === 'clear') {
            props.onChange([]);
            setInputValue('');
        } else {
            const value1 = (value as CreatableValue).value
            if (value1) {
                setInputValue(value1);
            }
        }
    };
    const handleInputChange = (inputVal: string): void => {
        setInputValue(inputVal);
    };
    const createChirp = (): void => {
        if (!inputValue) return;
        const {values} = props;
        if (!values || values.length === 0) {
            props.onChange([inputValue]);
        } else if (!values.find(val => val === inputValue)) {
            props.onChange([...values, inputValue]);
        }
        setInputValue('');
    };
    const onBlur = (): void => {
        createChirp();
    };
    const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>): void => {
        if (!inputValue) {
            if (props.onKeyDown) {
                props.onKeyDown(event);
            }
            return;
        }
        switch (event.key) {
            case 'Enter':
            case 'Tab':
                createChirp();
                event.preventDefault();
        }
    };
    return (
        <CreatableSelect<CreatableValue>
            components={components}
            inputValue={inputValue}
            isClearable
            isMulti
            inputId={props.placeholder || "creatable-input"}
            onBlur={onBlur}
            menuIsOpen={false}
            onChange={handleChange}
            onInputChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={props.placeholder}
            value={props.values?.map(createOption)}
        />
    );
};
