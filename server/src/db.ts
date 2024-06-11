import { Pool } from 'pg';

const pool = new Pool({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'postgres',
    password: 'password',
    port: 5432,
});

export const connection = () => {
    pool.connect();
    const query = {
        text: 'INSERT INTO member VALUES ($1, $2)',
        values: [1, '홍길동'],
    };
    pool.query(query)
        .then(res => {
            console.log(res);
            pool.end();
        })
        .catch(e => console.error(e.stack));
};

export default pool;
