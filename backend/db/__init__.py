from typing import Any, Annotated
from fastapi import Depends
from generated.prisma import Prisma, register
import generated.prisma.models as models
import generated.prisma.types as types
import generated.prisma.bases as bases
from . import partials as partials

db = Prisma()
db.connect()
register(db)
def get_db():
  try:
    while True:
      yield db
  finally:
    db.disconnect()

DB = Annotated[Prisma, Depends(get_db)]