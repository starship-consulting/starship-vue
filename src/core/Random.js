import Faker from 'faker'

Faker.locale = 'en';
const emailProviders = ['gmail', 'hotmail', 'yahoo', 'mail'];

var Random = {

    FirstName(gender) {
        return Faker.name.firstName(gender);
    },

    LastName: Faker.name.lastName,

    StreetAddress: Faker.address.streetAddress,

    City: Faker.address.city,

    State: Faker.address.stateAbbr,

    Name(gender) {
        return Random.FirstName(gender) + ' ' + Random.LastName();
    },
    
    Digits(length) {
        if (!length) {
            return 0;
        }

        return Math.floor(Math.pow((10), length - 1) + Math.random() * 9 * Math.pow(10, length - 1));
    },

    Date(start, end) {
        return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    },

    Email(firstName, lastName) {
        return Faker.internet.email(firstName, lastName);
    },

    EmailProvider() {
        return emailProviders[Random.Number(0, emailProviders.length - 1)];
    },

    Gender() {
        var male = Math.random(0, 1) < 0.5;

        return {
            gender: male ? 'male' : 'female',
            pronoun: male ? 'man' : 'woman',
            pronounPlural: male ? 'men' : 'women',
            value: male ? 0 : 1
        };
    },

    Number(min, max) {
        return parseInt(Math.random() * (max - min) + min);
    }
};

export default Random;