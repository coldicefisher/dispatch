CREATE TABLE users_by_email (
    email text,
    pwd text,
    first_name text,
    last_name text,
    trusted_devices list<text>,
    phone_numbers list<text>,
    uid uuid,
    PRIMARY KEY (email)
)