# API Reference

This document provides a detailed reference for all REST API endpoints exposed by the Mettle server.

## Conventions

- All endpoints are prefixed with `/api/` (see `server/routes/`).
- Authentication is via JWT (see `middlewares/authorization.ts`).

---

## Questions

### POST `/api/question/create/main`
Create a main question (Teacher only).

**Headers:**
- `Authorization: Bearer <token>`

**Body (form-data):**
```
questionText: string
file: (image/pdf upload)
```
**Success Response:**
```json
{
	"questionId": "<id>"
}
```

### POST `/api/question/create/sub`
Create a sub-question (Teacher only).

**Headers:**
- `Authorization: Bearer <token>`

**Body (JSON):**
```json
{
	"tag": "functional|qualitative|quantitative|calculation|evaluation",
	"value": "Question value",
	"questions": [
		{ "question": "Q1", "answer": "A1" },
		...
	]
}
```
**Success Response:**
```json
{
	"subQuestionId": "<id>"
}
```

### GET `/api/question/main/teacher`
Get all main questions for a teacher (Teacher only).

### GET `/api/question/main/student`
Get all main questions for a student (Student only).

### GET `/api/question/sub`
Get sub-questions (Auth required).

### POST `/api/question/edit/main`
Edit a main question (Teacher only).

### GET `/api/question/main`
Get a main question (Auth required).

### GET `/api/question`
Get the whole question (Auth required).

---

## Answers

### GET `/api/answer`
Get all answers (Auth required).

### GET `/api/answer/type`
Get answers by type (Student only).

### POST `/api/answer`
Submit an answer (Student only).

**Body (JSON):**
```json
{
	"answers": <answers>,
	"sessionId": "<id>",
	"type": "<type>",
	"subtype": "<subtype>"
}
```

---

## Sessions

### POST `/api/session/create`
Create a session (Student only).

**Body (JSON):**
```json
{
	"sessionName": "<name>"
}
```
**Success Response:**
```json
{
	"sessionId": "<id>"
}
```

### GET `/api/session/details`
Get session details (Student only).

### GET `/api/session/status`
Get session status (Student only).

### GET `/api/session/list`
List all sessions (Student only).

### DELETE `/api/session/delete`
Delete a session (Student only).

### POST `/api/session/notes`
Save session notes (Student only).

### POST `/api/session/addQuestion`
Add a question to a session (Student only).

---

## Auth (Login/Signup)

### POST `/api/login/login`
Login with email and password.

**Body (JSON):**
```json
{
	"email": "<email>",
	"password": "<password>"
}
```
**Success Response:**
```json
{
	"token": "<jwt>",
	"userId": "<id>",
	"designation": "Teacher|Student"
}
```

### POST `/api/login/signup`
Signup with email, name, password, and designation.

**Body (JSON):**
```json
{
	"email": "<email>",
	"name": "<name>",
	"password": "<password>",
	"designation": "Teacher|Student"
}
```
**Success Response:**
```json
{
	"token": "<jwt>",
	"userId": "<id>",
	"designation": "Teacher|Student"
}
```

---

Refer to `server/routes/` and `server/controllers/` for implementation details.
