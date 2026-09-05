# Currently Building

The homepage displays this section immediately after About and before Testimonials. Projects are stored in MongoDB, with a title, description, status, optional HTTP/HTTPS link, and timestamps. Newest projects appear first. No example projects are inserted into the database.

Sign in through the existing Google or LinkedIn buttons in Testimonials using the existing owner account (`liberteix@gmail.com`). Accounts marked `isAdmin` in the database see Add project, Edit, and Delete controls. The existing account creation logic only grants this role to the owner email. Guests and other signed-in users can only read this section. Deletion requires an inline confirmation.

The backend exposes public `GET /api/currently-building` and authenticated, admin-only `POST /api/currently-building`, `PUT /api/currently-building/:id`, and `DELETE /api/currently-building/:id`. Writes require JSON and validate fields and links on the server.

Deploy both frontend and backend. The existing MongoDB connection stores projects and sessions; no new environment variables are required. Authentication now uses random session tokens stored as hashes in MongoDB, with the existing ten-minute lifetime. Old user-ID cookies are rejected, so existing users must sign in again after deployment. Logout revokes the session. Google and LinkedIn sign-in require a verified email before linking accounts.

Validation: run `npm test` in backend and `npm run build` in frontend. Backend tests use an in-memory model stub and exercise HTTP access controls and CRUD; they do not require or modify a live database. Live OAuth and MongoDB integration must be checked in the deployed environment.
