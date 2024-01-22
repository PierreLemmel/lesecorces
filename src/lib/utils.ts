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