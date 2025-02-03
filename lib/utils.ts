export const mergeClasses = (...classes: (string|undefined|false)[]): string => {
    const result = classes.reduce((prev, curr) => {
        if (curr) {
            return prev + " " + curr;
        }
        else {
            return prev;
        }
    }, "");

    return result || ""; 
}

export function isEmpty<T extends { length: number }>(array: T) {
    return array.length === 0;
}

export interface GenerateIdOptions {
    length: number;
    type: "LettersOnly"|"Alphanumeric";
}

export function generateId(options?: Partial<GenerateIdOptions>): string {

    const {
        length = 8,
        type = "Alphanumeric"
    } = options || {};

    const characters = match(type, {
        "LettersOnly": "abcdefghijklmnopqrstuvwxyz",
        "Alphanumeric": "abcdefghijklmnopqrstuvwxyz0123456789"
    })
    
    let id = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        id += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return id;
}

type CaseList<T extends string, U> = { condition: (elt: T) => boolean, value: U }[]
type CaseListWithDefault<T extends string, U> = { cases: CaseList<T,U>, defaultValue: U }
type MatchMap<T extends string, U> = { [key in T]: U }
type Patterns<T extends string, U> = MatchMap<T, U>
| (Partial<MatchMap<T, U>> & { defaultValue: U })
| CaseList<T, U>
| CaseListWithDefault<T, U>

export function match<T extends string, U>(val: T, choices: Patterns<T, U>): U {
    if (Array.isArray(choices)) {
        const result = choices.find(c => c.condition)?.value;
        if (result !== undefined) {
            return result;
        }
        else {
            throw new Error("No match found");
        }
    }
    else if ("defaultValue" in choices) {
        if ("cases" in choices) {
            return choices.cases.find(c => c.condition)?.value || choices.defaultValue;
        }
        else {
            return choices[val] || choices.defaultValue;
        }
    }
    else {
        return choices[val];
    }
}

export function timeStampString(date = new Date()) {
    const YYYY = date.getFullYear();
    const MM = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const HH = String(date.getHours()).padStart(2, "0");
    const mm = String(date.getMinutes()).padStart(2, "0");
    const ss = String(date.getSeconds()).padStart(2, "0");

    return `${YYYY}${MM}${dd}-${HH}${mm}${ss}`;
}