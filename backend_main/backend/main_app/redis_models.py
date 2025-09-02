from redis_om import HashModel,  Field, get_redis_connection, Migrator
# Подключение к Redis
redis = get_redis_connection(
    host="localhost",
    port=6379
)

# Модель для OAuth state


class OAuthState(HashModel):
    state: str = Field(index=True)  # ✅ индексируем поле

    class Meta:
        database = redis
        global_ttl = 300


class OAuthCodeVerifier(HashModel):
    code_verifier: str = Field(index=True)  # ✅ индексируем поле
    code_challenge: str = Field(index=True)

    class Meta:
        database = redis
        global_ttl = 300


Migrator().run()
