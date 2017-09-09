import 'reflect-metadata';

import { ConnectionOptions, createConnection, getConnectionManager, getRepository } from 'typeorm';

import { User } from './entity/user';
import { UserCredential } from './entity/user_credential';


const connectionOptions: ConnectionOptions = {

    type: 'mysql',
    host: 'localhost',
    port: 3306,
    database: 'test',
    username: 'root',
    password: '',
    autoSchemaSync: true,
    logging: true,
    entities: [
        __dirname + '/entity/*.js',
    ],
};

createConnection(connectionOptions).then(async () => {
    
    // Creating new entities work.

    console.log('# 1. Creating new entity works.');

    const user = new User();
    const userCredential = new UserCredential();
  
    user.id = 1;
    user.username = 'zk';
    user.email = 'fuckzk@codgi.cc';
    user.privilege = 1;
  
    userCredential.user = user;
    userCredential.password = 'AwesomeTypeORM';
    userCredential.salt = 'IAmSalt';
  
    await getRepository(User).persist(user);
    await getRepository(UserCredential).persist(userCredential);


    // Updating existing entities fail.

    console.log('# 2. Updating existing entity fails.');

    // Obtain entites from database.
    const userInfo = await getRepository(User)
        .findOneById(1);
    
    const credentialInfo = await getRepository(UserCredential)
        .findOne({
            join: {
                alias: 'user_credential',
                innerJoinAndSelect: {
                    user: 'user_credential.user',
                },
            },
            where: {
                user: 1,
            },
        });
    
    // Throw erro if entities are not found.
    if (!userInfo) {
        throw new Error('Failed to obtain userInfo.');
    }

    if (!credentialInfo) {
        throw new Error('Failed to obtain credentialInfo.');
    }


    // Update entity info.
    userInfo.email = "user2@user.com";
    userInfo.username = "User";

    credentialInfo.password = 'TypeORMisAwesome';
    credentialInfo.salt = 'pleerockIsAwesome';

    await getRepository(User).persist(userInfo);
    await getRepository(UserCredential).persist(credentialInfo);

    // Close connection.
    getConnectionManager().get().close();

});

