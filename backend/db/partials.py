from datetime import datetime

from generated.prisma.bases import BaseUser


class UserBase(BaseUser):
  id: int
  username: str
  createdAt: datetime
  updatedAt: datetime
