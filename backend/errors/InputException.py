from typing_extensions import Self


class InputException(Exception):
    def __init__(self):
        self.fields = dict()
        super().__init__("Invalid input")

    def add(self, field: str, message: str) -> Self:
        self.fields[field] = message
        return self
