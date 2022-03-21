#!/bin/sh

psql -U "$POSTGRES_USER" <<-EOSQL
    create database smart_home;
    create user vozer with password 'wibuisthebest';
    grant all privileges on database smart_home to vozer;
EOSQL
