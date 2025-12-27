/**
 * Calculate Chinese zodiac based on birth year
 * 12-year cycle: Rat, Ox, Tiger, Rabbit, Dragon, Snake, Horse, Goat, Monkey, Rooster, Dog, Pig
 */

export enum ChineseZodiac {
    RAT = 'Rat',
    OX = 'Ox',
    TIGER = 'Tiger',
    RABBIT = 'Rabbit',
    DRAGON = 'Dragon',
    SNAKE = 'Snake',
    HORSE = 'Horse',
    GOAT = 'Goat',
    MONKEY = 'Monkey',
    ROOSTER = 'Rooster',
    DOG = 'Dog',
    PIG = 'Pig',
}

const ZODIAC_ANIMALS = [
    ChineseZodiac.RAT, // 0: 1900, 1912, 1924, 1936, 1948, 1960, 1972, 1984, 1996, 2008, 2020
    ChineseZodiac.OX, // 1: 1901, 1913, 1925, 1937, 1949, 1961, 1973, 1985, 1997, 2009, 2021
    ChineseZodiac.TIGER, // 2
    ChineseZodiac.RABBIT, // 3
    ChineseZodiac.DRAGON, // 4
    ChineseZodiac.SNAKE, // 5
    ChineseZodiac.HORSE, // 6
    ChineseZodiac.GOAT, // 7
    ChineseZodiac.MONKEY, // 8
    ChineseZodiac.ROOSTER, // 9
    ChineseZodiac.DOG, // 10
    ChineseZodiac.PIG, // 11
];

export function calculateChineseZodiac(birthday: Date): string {
    const year = birthday.getFullYear();

    // Chinese zodiac starts from 1900 as Year of the Rat
    // Calculate the offset from 1900
    const offset = (year - 1900) % 12;

    return ZODIAC_ANIMALS[offset];
}
