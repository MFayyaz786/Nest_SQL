import { Sequelize } from 'sequelize-typescript';
//import { Cat } from '../cats/cat.entity';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: 'Star',
        database: 'nest_test',
      });
      //sequelize.addModels();
      await sequelize.sync();
      return sequelize;
    },
  },
];