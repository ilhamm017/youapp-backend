/**
 * Calculate horoscope (zodiac sign) based on birthday
 * Western astrology based on month and day
 */

export enum Horoscope {
    ARIES = 'Aries',
    TAURUS = 'Taurus',
    GEMINI = 'Gemini',
    CANCER = 'Cancer',
    LEO = 'Leo',
    VIRGO = 'Virgo',
    LIBRA = 'Libra',
    SCORPIO = 'Scorpio',
    SAGITTARIUS = 'Sagittarius',
    CAPRICORN = 'Capricorn',
    AQUARIUS = 'Aquarius',
    PISCES = 'Pisces',
}

export function calculateHoroscope(birthday: Date): string {
    const month = birthday.getMonth() + 1; // getMonth() returns 0-11
    const day = birthday.getDate();

    // Capricorn: December 22 - January 19
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) {
        return Horoscope.CAPRICORN;
    }

    // Aquarius: January 20 - February 18
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) {
        return Horoscope.AQUARIUS;
    }

    // Pisces: February 19 - March 20
    if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) {
        return Horoscope.PISCES;
    }

    // Aries: March 21 - April 19
    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) {
        return Horoscope.ARIES;
    }

    // Taurus: April 20 - May 20
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) {
        return Horoscope.TAURUS;
    }

    // Gemini: May 21 - June 20
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) {
        return Horoscope.GEMINI;
    }

    // Cancer: June 21 - July 22
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) {
        return Horoscope.CANCER;
    }

    // Leo: July 23 - August 22
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) {
        return Horoscope.LEO;
    }

    // Virgo: August 23 - September 22
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) {
        return Horoscope.VIRGO;
    }

    // Libra: September 23 - October 22
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) {
        return Horoscope.LIBRA;
    }

    // Scorpio: October 23 - November 21
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) {
        return Horoscope.SCORPIO;
    }

    // Sagittarius: November 22 - December 21
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) {
        return Horoscope.SAGITTARIUS;
    }

    // Default fallback (should not reach here with valid dates)
    return Horoscope.CAPRICORN;
}
