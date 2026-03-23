# Dependency Model
We need to be able to run migration scripts from within the container.
We also don't want to bloat our image.

Therefore, everything needed for:
- The build process
- The migration process
- The application itself

Goes into production deps. The rest goes into development deps. It should be a good balance.
