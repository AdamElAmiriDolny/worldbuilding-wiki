from dotenv import load_dotenv
import os

load_dotenv()

# Object to attribute the values inside the .env file, which is sensitive data.
class Settings:
    app_name: str = os.getenv("APP_NAME", "Worldbuilding Wiki API")
    app_env: str = os.getenv("APP_ENV", "development")
    secret_key: str = os.getenv("SECRET_KEY", "change_this_later")
    database_url: str = os.getenv("DATABASE_URL", "")
    algorithm: str = os.getenv("ALGORITHM", "HS256")
    access_token_expire_minutes: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))

settings = Settings()