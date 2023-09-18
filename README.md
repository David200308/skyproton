# SkyProton

Source code of SkyProton Frontend &amp; Backend.

## Framework

- Frontend - Next.JS
- Backend - Node.JS
- Database - MySQL

## Backend API

- Auth Endpoint
  - Login
    - POST /auth/login
  - Signup
    - POST /auth/signup
- Service Endpoint
  - Add Teacher
    - POST /service/teacher/add
  - Search Teacher
    - GET /service/teacher/search?name="teacher_name"
  - Delete Teacher
    - DELETE /service/teacher/delete?id="teacher_id"
  - Update Teacher
    - POST /service/teacher/update
