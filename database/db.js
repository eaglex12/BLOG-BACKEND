import mongoose from 'mongoose';

const Connection = async (username, password) => {
    const URL = `mongodb://${username}:${password}@ac-vz3rm3q-shard-00-00.gz7yqeg.mongodb.net:27017,ac-vz3rm3q-shard-00-01.gz7yqeg.mongodb.net:27017,ac-vz3rm3q-shard-00-02.gz7yqeg.mongodb.net:27017/?ssl=true&replicaSet=atlas-tsufcs-shard-0&authSource=admin&retryWrites=true&w=majority`
    try {
        await mongoose.connect(URL, { useNewUrlParser: true })
        console.log('Database connected successfully');
    } catch (error) {
        console.log('Error while connecting to the database ', error);
    }
};

export default Connection;