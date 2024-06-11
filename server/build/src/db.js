"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connection = void 0;
const pg_1 = require("pg");
const pool = new pg_1.Pool({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'postgres',
    password: 'password',
    port: 5432,
});
const connection = () => {
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
exports.connection = connection;
exports.default = pool;
