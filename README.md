# Secure Notes API

Testing with Postman

1️-Login to Get JWT

Request 

Method: POST

URL: http://localhost:3000/auth/login

Body → raw → JSON:
``
{
  "email": "test@example.com",
  "password": "123456"
}``

Response Example
``
{
  "token": "..."
}``
Copy the token 

2️- Create a Note

Request

Method: POST

URL: http://localhost:3000/notes

Headers:

``Authorization: Bearer <Your_Token>``

Body → form-data:enter data as title , content and attachment if any

Response Example
``
{
  "id": "...",
  "title": "something",
  "content": "something.",
  "createdAt": "...",
  "attachmentPath": "uploads/abc123.png",
  "originalFileName": "something.png",
  "mimetype": "image/png",
  "size": 12345
}``

3️-Get All Notes

Request

Method: GET

URL: http://localhost:3000/notes

Headers:

``Authorization: Bearer <your_token>``

Response Example:
``
[
  {
    "id": "...",
    "title": "something",
    "content": "something",
    "createdAt": "..."
  }``
]

Notes are sorted by createdAt in descending order.

4️-Delete a Note

Request

Method: DELETE

URL: http://localhost:3000/notes/<NOTE_ID>

Headers:

``Authorization: Bearer <your_token>``
Response Example

``{
  "success": true,
  "deleted": {
    "id": "...",
    "title": "something",
    "content": "something."
  }
}``
