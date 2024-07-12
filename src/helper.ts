export class StringHelper {
    static toCamelCase(input: string): string {
        if(
            input.slice(-3) === '__c' ||
            input.slice(-3) === '__C'
        ) {
            input = input.slice(0, -3);
        }
        return input
            .split('_')
            .map((word, index) => {
                if (index === 0) {
                    // Check if the first word is all uppercase
                    if (word === word.toUpperCase()) {
                        return word;
                    }
                    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
                }
                return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
            })
            .join('');
    }

    static isValidStringWithoutSpaces(input: string): boolean {
        // Check if the string contains any space characters
        return !/\s/.test(input);
    }

    static isValidAPIVersion(input: string): boolean {
        // Check if the string matches the pattern for positive integers or numbers with .0 decimal
        return /^[1-9]\d*(\.0)?$/.test(input);
    }
}