from dotenv import load_dotenv
import os

load_dotenv()

# Object to attribute the values inside the .env file, which is sensitive data.
class Settings:
    app_name = os.getenv("APP_NAME")
    app_env = os.getenv("APP_ENV")
    secret_key = os.getenv("SECRET_KEY")
    database_url = os.getenv("DATABASE_URL")

settings = Settings()