# Snowflake Utilities
This repo assumes you have an instance of Snowflake available to you with ACCOUNTADMIN access. If you don't yet have an account, you can start with a free trial [here](https://signup.snowflake.com/). If you already have an account but not ACCOUNTADMIN access, you'll need to reach out to your Snowflake administrator. 

This deployment is using an instance of Snowflake deployed on Google Cloud Platform. This process can be completed on other cloud providers' Snowflake accounts, but will require a substantial amount of adaptation for the use of Snowpipe from bucket storage, and minor tweaks elsewhere in the code. We'll do our best to call out when these changes may occur. 

You may also want to have the SnowSQL Client installed if you plan to interact with your database via the command line. Instructions can be found [here](https://docs.snowflake.com/en/user-guide/getting-started-tutorial-prerequisites.html#snowsql-installation)

## Intro

Contains documentation and scripts used to create and administer Snowflake databases, warehouses, tables, users, roles, pipes, and other objects either via [SnowSQL (CLI Client)](https://docs.snowflake.com/en/user-guide/snowsql.html) or through the Snowflake Web UI

## Scripts 
Scripts to be used via SnowSQL to execute functions, manipulate data, etc. 

## Queries
Raw SQL Queries to be used either through the Web UI or using the CLI

### DDL 
Queries used to create database infrastructure, roles, a user, and grant appropriate permissions
