import React from "react";
import {fireEvent, render, screen} from '@testing-library/react';
import Creatable from "../../../../components/ui/input/Creatable";

describe('testing creatable', () => {

  it("add chirp on pressing enter with start value null", async () => {
    let savedValues: string[] | null = null;
    const onChange = (values: string[]): void => {
      savedValues = values;
    };
    render(<Creatable values={savedValues} placeholder='test' onChange={onChange}/>);
    const input = screen.getByRole('textbox', {name: ""}) as HTMLInputElement;

    fireEvent.change(input, {target: {value: 'Good Day'}});
    expect(input.value).toBe('Good Day');
    expect(savedValues).toBeNull();

    fireEvent.keyDown(input, {key: 'Enter'});
    expect(savedValues).not.toBeNull();
    //needed for typescript
    if (Array.isArray(savedValues)) {
      expect(savedValues[0]).toBe('Good Day');
    } else {
      fail('savedValues is not an array');
    }
    expect(input.value).toBe('');
  });

  it("add chirp on pressing enter", async () => {
    let savedValues: string[] = [];
    const onChange = (values: string[]): void => {
      savedValues = values;
    };
    render(<Creatable values={savedValues} placeholder='test' onChange={onChange}/>);
    const input = screen.getByRole('textbox', {name: ""}) as HTMLInputElement;

    fireEvent.change(input, {target: {value: 'Good Day'}});
    expect(input.value).toBe('Good Day');
    expect(savedValues.length).toBe(0);

    fireEvent.keyDown(input, {key: 'Enter'});
    expect(savedValues.length).toBe(1);
    expect(savedValues[0]).toBe('Good Day');
    expect(input.value).toBe('');
  });

  it("add two chirp on pressing enter", async () => {
    let savedValues: string[] = [];
    const onChange = (values: string[]): void => {
      savedValues = values;
    };
    const {rerender} = render(<Creatable values={savedValues} placeholder='test' onChange={onChange}/>);
    const input = screen.getByRole('textbox', {name: ""}) as HTMLInputElement;

    fireEvent.change(input, {target: {value: 'Good Day'}});
    expect(input.value).toBe('Good Day');
    expect(savedValues.length).toBe(0);

    fireEvent.keyDown(input, {key: 'Enter'});
    expect(savedValues.length).toBe(1);
    expect(input.value).toBe('');

    rerender(<Creatable values={savedValues} placeholder='test' onChange={onChange}/>);
    fireEvent.change(input, {target: {value: 'Good Day2'}});
    fireEvent.keyDown(input, {key: 'Enter'});
    expect(savedValues.length).toBe(2);
    expect(savedValues[0]).toBe('Good Day');
    expect(savedValues[1]).toBe('Good Day2');
    expect(input.value).toBe('');
  });

  it("add chirp on pressing tab", async () => {
    let savedValues: string[] = [];
    const onChange = (values: string[]): void => {
      savedValues = values;
    };
    render(<Creatable values={savedValues} placeholder='test' onChange={onChange}/>);
    const input = screen.getByRole('textbox', {name: ""}) as HTMLInputElement;

    fireEvent.change(input, {target: {value: 'Good Day'}});
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
    };
    render(<Creatable values={savedValues} placeholder='test' onChange={onChange}/>);
    const input = screen.getByRole('textbox', {name: ""}) as HTMLInputElement;
    fireEvent.change(input, {target: {value: 'Good Day'}});
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
    };
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
    };
    let keyPressed = false;
    const onKeyDown = (e: React.KeyboardEvent<HTMLElement>): void => {
      if (e.key === 'Enter') {
        keyPressed = true;
      }
    };
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
    };
    let keyPressed = false;
    const onKeyDown = (e: React.KeyboardEvent<HTMLElement>): void => {
      if (e.key === 'Enter') {
        keyPressed = true;
      }
    };
    render(<Creatable values={savedValues} onKeyDown={onKeyDown} onChange={onChange}/>);
    const input = screen.getByRole('textbox', {name: ""}) as HTMLInputElement;

    fireEvent.change(input, {target: {value: 'Good Day'}});
    expect(input.value).toBe('Good Day');
    fireEvent.keyDown(input, {key: 'Enter'});
    expect(keyPressed).toBeFalsy();
  });

  it("dont use onKeyDown if onKeyDown is not defined", async () => {
    let savedValues: string[] = [];
    const onChange = (values: string[]): void => {
      savedValues = values;
    };
    render(<Creatable values={savedValues} onChange={onChange}/>);
    const input = screen.getByRole('textbox', {name: ""}) as HTMLInputElement;

    expect(input.value).toBe('');
    fireEvent.keyDown(input, {key: 'Enter'});
    expect(input.value).toBe('');
    expect(savedValues.length).toBe(0);
  });

  it("remove a value", async () => {
    let savedValues: string[] = ["test1", "test2", "test3"];
    const onChange = (values: string[]): void => {
      savedValues = values;
    };
    const {container} = render(<Creatable values={savedValues} placeholder='test' onChange={onChange}/>);
    const clearDiv = await container.querySelector('#test > div > div:nth-child(1) > div:nth-child(1) > div:nth-child(2)') as HTMLDivElement;

    expect(savedValues.length).toBe(3);
    fireEvent.click(clearDiv);
    expect(savedValues.length).toBe(2);
  });
});
