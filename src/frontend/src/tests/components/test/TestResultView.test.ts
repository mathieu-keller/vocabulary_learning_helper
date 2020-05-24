import {render} from '@testing-library/react'
import TestResultView from '../../../components/test/TestResultView';

describe('testing TestResultView', () => {
    it('show wrong input', async () => {
        const props = {
            vocabs: [
                {
                    id: '1',
                    userFirst: {key: "German", value: "hallo"},
                    userSecond: {key: "English", value: "hello"},
                    dbFirst: {key: "German", value: "hallo"},
                    dbSecond: {key: "English", value: "wrong"},
                }],
            correct: 1,
        }
        const {getByTestId} = render(TestResultView(props))
        expect(getByTestId('result-wrong-vocabularies').children.length).toBe(2) // 2 grid items per wrong input
    });

    it('ignore case sensitive', async () => {
        const props = {
            vocabs: [
                {
                    id: '1',
                    userFirst: {key: "German", value: "hallo"},
                    userSecond: {key: "English", value: "Hello"},
                    dbFirst: {key: "German", value: "hallo"},
                    dbSecond: {key: "English", value: "hello"},
                },
                {
                    id: '2',
                    userFirst: {key: "German", value: "hallo"},
                    userSecond: {key: "English", value: "hello"},
                    dbFirst: {key: "German", value: "hallo"},
                    dbSecond: {key: "English", value: "Hello"},
                }],
            correct: 1,
        }
        const {getByTestId} = render(TestResultView(props))
        expect(getByTestId('result-wrong-vocabularies').children.length).toBe(0)
    });

    it('ignore spaces', async () => {
        const props = {
            vocabs: [
                {
                    id: '1',
                    userFirst: {key: "German", value: "hallo"},
                    userSecond: {key: "English", value: " hello "},
                    dbFirst: {key: "German", value: "hallo"},
                    dbSecond: {key: "English", value: "hello"},
                },
                {
                    id: '2',
                    userFirst: {key: "German", value: "hallo"},
                    userSecond: {key: "English", value: "hello"},
                    dbFirst: {key: "German", value: "hallo"},
                    dbSecond: {key: "English", value: " hello "},
                }],
            correct: 1,
        }
        const {getByTestId} = render(TestResultView(props))
        expect(getByTestId('result-wrong-vocabularies').children.length).toBe(0)
    });

    it('calculateGrade all correct', async () => {
        const vocabs = [];
        for (let i = 1; i <= 100; i++) {
            vocabs.push({
                id: `${i}`,
                userFirst: {key: "German", value: "hallo"},
                userSecond: {key: "English", value: "hello"},
                dbFirst: {key: "German", value: "hallo"},
                dbSecond: {key: "English", value: "hello"},
            })
        }
        let step = 0;
        const grades = ["1", "1.3", "1.7", "2.0", "2.3", "2.7", "3.0", "3.3", "3.7", "4.0", "5.0", "5.0", "5.0"];
        for (let i = 95; i >= 35; i -= 5) {
            const props = {
                vocabs: vocabs,
                correct: i,
            }
            const {unmount, getByTestId} = render(TestResultView(props))
            expect(getByTestId('result-title').innerHTML).toBe(`${props.correct}/100. Correct. You got a ${grades[step]} grade`)
            unmount();
            step++;
        }
    })
})