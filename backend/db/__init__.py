from typing import Any, Annotated
from fastapi import Depends
from generated.prisma import Prisma, register
import generated.prisma.models as models
import generated.prisma.types as types
import generated.prisma.bases as bases
from . import partials as partials


class Database:
    def __init__(self, db: Prisma):
        db.connect()
        self.db = db

    def __call__(self):
        return self.db

    def __del__(self):
        self.db.disconnect()


db = Database(Prisma())

DB = Annotated[Prisma, Depends(db)]
