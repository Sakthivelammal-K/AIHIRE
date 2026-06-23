from passlib.context import CryptContext
from jose import jwt


pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)


SECRET_KEY = "aihire_secret_key"
ALGORITHM = "HS256"



def hash_password(password):

    return pwd_context.hash(password)



def verify_password(password, hashed_password):

    return pwd_context.verify(
        password,
        hashed_password
    )



def create_token(data):

    return jwt.encode(
        data,
        SECRET_KEY,
        algorithm=ALGORITHM
    )