# SAE Backend

## Models

- User: id, name, clg_name
- Event: id, name, date_time
- UserEvent: user_id, event_id, attended, timestamp_attended
- UserLocation: user_id, geofence(lat, long, radius), status, timestamp

## Routes

- POST /post_user
- GET /get_user/:id
- GET /get_event/:id
- PATCH /patch_user_event
- GET /get_user_event
- GET /get_user_location

## Run

1. npm install
2. create .env from .env.example
3. npm run dev
