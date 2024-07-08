# IPST task 2 backend

Authorization module: signup, signin using JWT tokens, registration email confirmation and password reset email confirmation

## Authorization

Access token stored in body of response in signin route

Access token should be stored in Authorization header of request to private routes

Refresh token stored in http-only cookie and should be sent with request to refresh route

## ENV variables example

```
DATABASE_URL="postgresql://postgres:root@localhost:5433/user?schema=public"
JWT_ACCESS_SECRET=oiaecrgjkmn138945casdf
JWT_REFRESH_SECRET=hujioacefmgr6789025yfweciourghj29s3r803d5g4iuhj24t09
```
## Swagger API

[API](https://iat39.devwonders.com:8077/api)
