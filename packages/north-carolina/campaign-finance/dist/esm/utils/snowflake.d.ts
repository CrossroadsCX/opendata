import snowflake from 'snowflake-sdk';
export declare const getConnection: () => Promise<snowflake.Connection | null>;
export declare const closeConnection: () => Promise<void>;
