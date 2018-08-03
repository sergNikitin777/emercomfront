import faker from 'faker';
faker.locale = 'ru';

export default (limit = 5, arrayData = false) => {
  const data = [];
  for (let i = 1; i <= limit; i++) {
    let row = null;
    if (arrayData) {
      row = [
        i,
        faker.address.state(),
        faker.address.country(),
        faker.image.avatar(),
        faker.address.city(),
        faker.name.jobTitle(),
        faker.lorem.sentence(),
		faker.name.findName(),
		faker.name.findName(),
        faker.random.boolean(),
        faker.date.past()
      ];
    } else {
      row = {
        id: i,
        salary: faker.address.state(),
        country: faker.address.country(),
        avatar: faker.image.avatar(),
        city: faker.address.city(),
        job: faker.name.jobTitle(),
        description: faker.lorem.sentence(),
		name: faker.name.findName(),
		name: faker.name.findName(),
        active: faker.random.boolean(),
        birthday: faker.date.past()
      };
    }
    data.push(row);
  }
  return data;
}