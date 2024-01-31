# Todo backend

Uses [Poetry](https://python-poetry.org/) for package management (pip is pretty bad)

To run without docker (requires poetry):

- `poetry run install`
- `poetry run prisma generate` - generates database files and prisma client
- `poetry run prisma db push` - sets up the database based on schema.prisma
  - I didn't do migrations for this example, however prisma has some tooling around that as well
- `poetry run uvicorn app:app --reload --host 0.0.0.0` - start the app using uvicorn as the server, in dev mode with hot reloading

While running, http://localhost:8000/docs has autogenerated swagger documentation thanks to FastAPI

## Testing

Tests are written using pytest and FastAPI's test client

Running:

- make sure the database is running
  - I'm using a separate database for testing, and overriding dependency injection.
  - In a real app this would likely be a separate docker container or something different entirely, however for the purpose of this it's reasonable to just create a separate database in the same postgres instance
- Make sure you're able to run the app without docker (see above), you need prisma binaries and generated client
- run `initTests.sh` file to push prisma schema to the test database
- `poetry run pytest` to run unit tests

## Libraries

- FastAPI - High performance server framework
  - I initially tried flask, however it has no type safety or testing support, or many other features that come with FastAPI.
  - This comes bundled with a lot of other dependencies, like typing, starlette or pydantic
- python-prisma - Prisma ORM implementation with python
  - Due to some quirks in how prisma works, this isn't really too reliable. In the future I'd use a different ORM instead, unless I was using multiple languages for backend that all had a prisma implementation
  - I used a synchronous api, however prisma python also provides an async option for better concurency with multiple requests
- pytest - unit tests
- python jose - JWT handling

## Implementation details

- Authentication done with a basic JWT Bearer token containing the username
- Prisma client dependency injection
  - Due to the way prisma works, I opted to establish a permanent connection to the DB instead of recreating it every time (as that can get resource intensive, specifically with prisma)