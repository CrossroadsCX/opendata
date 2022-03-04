import { Binds } from 'snowflake-sdk';
export declare type ConnectionArgs = {
    sqlText: string;
    binds: Binds;
};
export declare type LogToSnowflakeEvent = {
    data: string;
};
interface LogToSnowflake {
    (input: LogToSnowflakeEvent): Promise<unknown>;
}
export declare const logToSnowflake: LogToSnowflake;
export {};
