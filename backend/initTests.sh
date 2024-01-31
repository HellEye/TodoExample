#!/bin/bash
source ".env"
export DATABASE_URL=$TEST_DATABASE_URL
poetry run prisma db push