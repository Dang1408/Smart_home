#!/bin/sh

psql -U "$POSTGRES_USER" <<-EOSQL
    create database safe1;
    create user safe1admin with password 'securepassword';
    grant all privileges on database safe1 to safe1admin;
EOSQL