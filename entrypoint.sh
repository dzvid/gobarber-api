#!/bin/bash
set -e

yarn sequelize db:migrate

exec "$@"
