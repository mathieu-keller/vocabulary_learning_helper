import {fireEvent, render, screen} from '@testing-library/react';
import React from "react";
import Creatable from "../../../../components/ui/input/Creatable";

describe('testing creatable', () => {

    it("add chirp on pressing enter", async () => {
        let savedValues: string[] = [];
        const onChange = (values: string[]): void => {
            savedValues = values;
        }
        render(<Creatable values={savedValues} placeholder='test' onChange={onChange}/>);
        const input = screen.getByRole('textbox', {name: ""}) as HTMLInputElement;

        fireEvent.change(input, {target: {value: 'Good Day'}})
        expect(input.value).toBe('Good Day');
        expect(savedValues.length).toBe(0);

        fireEvent.keyDown(input, {key: 'Enter'});
        expect(savedValues.length).toBe(1);
        expect(savedValues[0]).toBe('Good Day');
        expect(input.value).toBe('');
    });

    it("add chirp on pressing tab", async () => {
        let savedValues: string[] = [];
        const onChange = (values: string[]): void => {
            savedValues = values;
        }
        render(<Creatable values={savedValues} placeholder='test' onChange={onChange}/>);
        const input = screen.getByRole('textbox', {name: ""}) as HTMLInputElement;

        fireEvent.change(input, {target: {value: 'Good Day'}})
        expect(input.value).toBe('Good Day');
        expect(savedValues.length).toBe(0);

        fireEvent.keyDown(input, {key: 'Tab'});
        expect(savedValues.length).toBe(1);
        expect(savedValues[0]).toBe('Good Day');
        expect(input.value).toBe('');
    });

    it("add chirp on Blur", async () => {
        let savedValues: string[] = [];
        const onChange = (values: string[]): void => {
            savedValues = values;
        }
        render(<Creatable values={savedValues} placeholder='test' onChange={onChange}/>);
        const input = screen.getByRole('textbox', {name: ""}) as HTMLInputElement;
        fireEvent.change(input, {target: {value: 'Good Day'}})
        expect(input.value).toBe('Good Day');
        expect(savedValues.length).toBe(0);
        fireEvent.blur(input);
        expect(savedValues.length).toBe(1);
        expect(savedValues[0]).toBe('Good Day');
        expect(input.value).toBe('');
    });

    it("dont add chirp on Blur if value is empty", async () => {
        let savedValues: string[] = [];
        const onChange = (values: string[]): void => {
            savedValues = values;
        }
        render(<Creatable values={savedValues} placeholder='test' onChange={onChange}/>);
        const input = screen.getByRole('textbox', {name: ""}) as HTMLInputElement;

        expect(input.value).toBe('');
        expect(savedValues.length).toBe(0);
        fireEvent.blur(input);
        expect(savedValues.length).toBe(0);
    });

    it("use onKeyDown if value \"\"", async () => {
        let savedValues: string[] = [];
        const onChange = (values: string[]): void => {
            savedValues = values;
        }
        let keyPressed = false;
        const onKeyDown = (e: React.KeyboardEvent<HTMLElement>): void => {
            if (e.key === 'Enter') {
                keyPressed = true;
            }
        }
        render(<Creatable values={savedValues} onKeyDown={onKeyDown} onChange={onChange}/>);
        const input = screen.getByRole('textbox', {name: ""}) as HTMLInputElement;

        expect(input.value).toBe('');
        fireEvent.keyDown(input, {key: 'Enter'});
        expect(keyPressed).toBeTruthy();
    });

    it("dont use onKeyDown if value is not empty", async () => {
        let savedValues: string[] = [];
        const onChange = (values: string[]): void => {
            savedValues = values;
        }
        let keyPressed = false;
        const onKeyDown = (e: React.KeyboardEvent<HTMLElement>): void => {
            if (e.key === 'Enter') {
                keyPressed = true;
            }
        }
        render(<Creatable values={savedValues} onKeyDown={onKeyDown} onChange={onChange}/>);
        const input = screen.getByRole('textbox', {name: ""}) as HTMLInputElement;

        fireEvent.change(input, {target: {value: 'Good Day'}})
        expect(input.value).toBe('Good Day');
        fireEvent.keyDown(input, {key: 'Enter'});
        expect(keyPressed).toBeFalsy();
    });
});