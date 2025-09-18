# backend_main/backend/users/models.py
import uuid
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.utils import timezone
from django.db.models.deletion import CASCADE
from django.core.exceptions import ValidationError

# ----------------------------
# Менеджер пользователя (минимальный)
# ----------------------------


class CustomUserManager(BaseUserManager):
    def create_user(self, username=None, email=None, password=None, **extra_fields):
        if not username and not email:
            raise ValueError("User must have username or email")
        email = self.normalize_email(email)
        user = self.model(email=email, username=username, **extra_fields)
        if password:  # дописанное
            user.set_password(password)  # дописанное
        user.save(using=self._db)
        return user

# ----------------------------
# Пользователь
# ----------------------------


class User(AbstractBaseUser, PermissionsMixin):
    id = models.UUIDField(
        primary_key=True, default=uuid.uuid4, editable=False, unique=True)
    username = models.CharField(
        max_length=150, unique=True, default="username")
    email = models.EmailField(unique=True, null=True, blank=True)
    first_name = models.CharField(max_length=30, blank=True)
    last_name = models.CharField(max_length=30, blank=True)
    avatar_url = models.URLField(blank=True, null=True)
    roulet_chance = models.FloatField(default=1, null=False, blank=False)
    upgrade_chance = models.FloatField(default=1, null=False, blank=False)
    case_chance = models.FloatField(default=1, null=False, blank=False)
    contracts_chance = models.FloatField(default=1, null=False, blank=False)
    battles_chance = models.FloatField(default=1, null=False, blank=False)
    item_state_chance = models.FloatField(default=1, null=False, blank=False)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(default=timezone.now, editable=False)
    token_version = models.PositiveIntegerField(
        blank=True, null=False, default=0)
    objects = CustomUserManager()
    money_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0
    )
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='customuser_set',
        blank=True,
        help_text='The groups this user belongs to.',
        verbose_name='groups',
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='customuser_set',
        blank=True,
        help_text='Specific permissions for this user.',
        verbose_name='user permissions',
    )
    USERNAME_FIELD = 'id'
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.username or str(self.id)

# ----------------------------
# Социальные аккаунты
# ----------------------------


class SocialAccount(models.Model):
    PROVIDER_CHOICES = [
        ('google', 'Google'),
        ('vk', 'VK'),
        ('steam', 'Steam'),
    ]
    verified_email = models.BooleanField(default=False, blank=True, null=True)
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='social_accounts')
    provider = models.CharField(max_length=20, choices=PROVIDER_CHOICES)
    provider_user_id = models.CharField(max_length=255)  # sub/id/steamid
    access_token = models.TextField(blank=True, null=True)
    refresh_token = models.TextField(blank=True, null=True)
    # любые дополнительные данные
    extra_data = models.JSONField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('provider', 'provider_user_id')

    def __str__(self):
        return f"{self.provider} account for {self.user}"


class SteamItemCs(models.Model):
    """Базовое описание предмета CS:GO / CS2 (тип предмета без уникальных характеристик)."""

    RARITY_CHOICES = [
        ("usuall", "Usual"),
        ("rare", "Rare"),
        ("elite", "Elite"),
        ("epic", "Epic"),
        ("classified", "Classified"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    appid = models.PositiveIntegerField(default=730, blank=True, null=True)
    classid = models.CharField(max_length=50, blank=True, null=True)
    instanceid = models.CharField(max_length=50, default="0")
    item_model = models.CharField(max_length=50, null=False, blank=True)
    item_style = models.CharField(max_length=50, null=False, blank=True)
    name = models.CharField(max_length=70, null=False, blank=True)

    price = models.DecimalField(
        max_digits=10,       # всего цифр
        decimal_places=2,    # знаков после запятой
        null=False,
        blank=False
    )
    commodity = models.BooleanField(default=False)  # Stackable товар или нет
    rarity = models.CharField(
        max_length=20, choices=RARITY_CHOICES, default="usuall")
    icon_url = models.URLField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        item_model_clean = self.item_model.strip() if self.item_model else ""
        item_style_clean = self.item_style.strip() if self.item_style else ""
        self.name = f"{item_model_clean} | {item_style_clean}"
        super().save(*args, **kwargs)

    class Meta:
        unique_together = ('appid', 'classid', 'instanceid')
        verbose_name = "Steam Item CS"
        verbose_name_plural = "Steam Items CS"

    def __str__(self):
        return f"{self.name} [{self.rarity}]"


class InventoryItem(models.Model):
    """Конкретный экземпляр предмета у игрока."""

    EXTERIOR_CHOICES = [
        ("factory_new", "Factory New"),
        ("minimal_wear", "Minimal Wear"),
        ("field_tested", "Field-Tested"),
        ("well_worn", "Well-Worn"),
        ("battle_scarred", "Battle-Scarred"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    steam_item = models.ForeignKey(
        SteamItemCs, on_delete=models.CASCADE, related_name="instances")
    # assetid = models.CharField(max_length=100, unique=True)  # Уникальный ID предмета в Steam

    exterior_wear = models.CharField(
        max_length=20, choices=EXTERIOR_CHOICES, null=False, blank=False)

    market_hash_name = models.CharField(max_length=250, blank=True, null=True)

    owner = models.ForeignKey(User,
                              on_delete=models.CASCADE, related_name="inventory")
    tradable = models.BooleanField(default=True)
    marketable = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Inventory Item"
        verbose_name_plural = "Inventory Items"

    def save(self, *args, **kwargs):
        """Автоматически формируем market_hash_name после выпадения."""
        if not self.market_hash_name:
            wear_display = dict(self.EXTERIOR_CHOICES).get(
                self.exterior_wear, "")
            self.market_hash_name = f"{self.steam_item.name} ({wear_display})"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.market_hash_name} - {self.owner}"

    @property
    def rarity(self):
        """Редкость предмета берется из базового SteamItemCs."""
        return self.steam_item.rarity

    @property
    def short_name(self):
        """Короткое имя предмета без состояния износа."""
        return self.steam_item.name

    @property
    def full_name(self):
        """Полное имя предмета, включая состояние (market_hash_name)."""
        if self.market_hash_name:
            return self.market_hash_name
        wear_display = dict(self.EXTERIOR_CHOICES).get(self.exterior_wear, "")
        return f"{self.steam_item.name} ({wear_display})"


class ItemsOrders(models.Model):
    inventory_item = models.ForeignKey(
        InventoryItem, on_delete=CASCADE, related_name='orders')
    trade_link = models.URLField(blank=True, null=True)
    order_date = models.DateTimeField(default=timezone.now)
    completed = models.BooleanField(default=False)  # Чекбокс выполнения заказа

    class Meta:
        verbose_name = "Item Order"
        verbose_name_plural = "Item Orders"

    def __str__(self):
        return f"{self.inventory_item.market_hash_name} - {self.inventory_item.owner.username}"

    @property
    def market_hash_name(self):
        """Возвращает market_hash_name предмета для админки и UI."""
        return self.inventory_item.market_hash_name


class Case(models.Model):
    CASE_TYPE_CHOICES = [
        ("standart_case", "Стандартный кейс"),
        ("season_case", "Сезонный кейс"),
        ("bloger_case", "Блогерский кейс"),
    ]
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    # {"en": "Blue Case", "ru": "Синий кейс"}
    name_ru = models.CharField(max_length=70, null=False, blank=False)
    name_en = models.CharField(max_length=70, null=False, blank=False)
    name = models.JSONField(default=dict, blank=True)
    icon_url = models.URLField(blank=True, null=True)
    price = models.DecimalField(
        max_digits=10,       # всего цифр
        decimal_places=2,    # знаков после запятой
        null=False,
        blank=False
    )
    created_at = models.DateTimeField(auto_now_add=True)
    type = models.CharField(
        max_length=20, choices=CASE_TYPE_CHOICES, default="standart_case")

    class Meta:
        verbose_name = "Case"
        verbose_name_plural = "Cases"

    def save(self, *args, **kwargs):
        """Автоматически формируем name_json из name_ru и name_en."""
        self.name = {
            "ru": self.name_ru,
            "en": self.name_en
        }
        super().save(*args, **kwargs)

    def __str__(self):
        return self.get_name("en")  # default fallback

    def get_name(self, lang=None):
        """Возвращает имя кейса на указанной локали"""
        if not lang:
            from django.utils import translation
            lang = translation.get_language()
        return self.name.get(lang, next(iter(self.name.values()), "Unnamed Case"))


class CaseItem(models.Model):
    """Предмет внутри кейса с шансом выпадения"""
    case = models.ForeignKey(
        Case, on_delete=models.CASCADE, related_name='items')
    steam_item = models.ForeignKey('SteamItemCs', on_delete=models.CASCADE)
    drop_chance = models.FloatField(
        null=False,
        blank=False,
        help_text="Шанс выпадения предмета в процентах (0-100)"
    )

    class Meta:
        verbose_name = "Case Item"
        verbose_name_plural = "Case Items"
        unique_together = ('case', 'steam_item')

    def __str__(self):
        return f"{self.steam_item.name} ({self.drop_chance}%)"

    def clean(self):
        """Проверяем суммарный шанс при добавлении нового предмета"""
        if self.drop_chance < 0 or self.drop_chance > 100:
            raise ValidationError("drop_chance должен быть между 0 и 100")

        # Сумма всех других предметов в кейсе
        existing_sum = (
            CaseItem.objects
            .filter(case=self.case)
            # исключаем текущий объект, если редактирование
            .exclude(pk=self.pk)
            .aggregate(total=models.Sum('drop_chance'))
        )['total'] or 0

        if existing_sum + self.drop_chance > 100:
            raise ValidationError(
                f"Суммарный шанс всех предметов в кейсе не может превышать 100%. "
                f"Текущая сумма: {existing_sum}%"
            )

    def save(self, *args, **kwargs):
        self.full_clean()  # вызывает clean() перед сохранением
        super().save(*args, **kwargs)


class Advertisement(models.Model):
    # Первый объект с timer
    title_1 = models.JSONField(default=dict, blank=True)

    title_1_ru = models.CharField(max_length=255, null=False, blank=False)
    title_1_en = models.CharField(max_length=255, null=False, blank=False)

    subTitle_1 = models.JSONField(default=dict, blank=True)

    subTitle_1_ru = models.CharField(max_length=255, null=False, blank=False)
    subTitle_1_en = models.CharField(max_length=255, null=False, blank=False)
    imgUrl_1 = models.URLField(max_length=255, null=False, blank=False)
    data_and_time = models.DateTimeField(
        default=timezone.now, null=False, blank=False)
    # Второй объект без timer
    title_2 = models.JSONField(default=dict, blank=True)

    title_2_ru = models.CharField(max_length=255, null=False, blank=False)
    title_2_en = models.CharField(max_length=255, null=False, blank=False)

    subTitle_2 = models.JSONField(default=dict, blank=True)

    subTitle_2_ru = models.CharField(max_length=255, null=False, blank=False)
    subTitle_2_en = models.CharField(max_length=255, null=False, blank=False)
    imgUrl_2 = models.URLField(max_length=255, null=False, blank=False)

    def save(self, *args, **kwargs):
        """Автоматически формируем name_json из name_ru и name_en."""
        self.title_1 = {
            "ru": self.title_1_ru,
            "en": self.title_1_en
        }
        self.title_2 = {
            "ru": self.title_2_ru,
            "en": self.title_2_en
        }
        self.subTitle_1 = {
            "ru": self.subTitle_1_ru,
            "en": self.subTitle_1_en
        }
        self.subTitle_2 = {
            "ru": self.subTitle_2_ru,
            "en": self.subTitle_2_en
        }
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.title_1} / {self.title_2}"


class BackgroundMainPage(models.Model):
    pc_background_url = models.URLField(null=False, blank=False)
    mobile_background_url = models.URLField(null=False, blank=False)
    pc_background_grass_url = models.URLField(null=False, blank=False)
    mobile_background_grass_url = models.URLField(null=False, blank=False)


class Raffles(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, null=False, blank=False)
    prize_item = models.ForeignKey(
        SteamItemCs, on_delete=models.SET_NULL, related_name="raffles", null=True, blank=False)
    players = models.ManyToManyField(
        User, related_name="raffles", blank=True)
    participate_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=False,
        blank=False
    )
    fake_users_amount = models.PositiveIntegerField(
        default=0, null=True, blank=True)
    max_users_amount = models.PositiveIntegerField(null=False, blank=False)
    start_date = models.DateTimeField(
        auto_now_add=True, null=False, blank=False)
    end_date = models.DateTimeField(null=False, blank=False)
    winner = models.ForeignKey(
        User, on_delete=models.SET_NULL, related_name="raffles_champion", blank=True, null=True)

    def clean(self):
        # Проверяем условие
        if self.fake_users_amount > self.max_users_amount:
            raise ValidationError(
                "fake_users_amount не может быть больше max_users_amount")
        if self.participate_price < 0:
            raise ValidationError(
                "Цена участия не может быть меньше нуля")
        if timezone.now() > self.end_date:
            raise ValidationError({
                "end_date": "Дата окончания должна быть позже даты начала"
            })

    def get_name(self, lang=None):
        return self.name


class GlobalCoefficient(models.Model):
    raffles_global = models.FloatField(
        default=1.0, verbose_name="Коэф. розыгрышей")
    cases_global = models.FloatField(default=1.0, verbose_name="Коэф. кейсов")
    upgrades_global = models.FloatField(
        default=1.0, verbose_name="Коэф. апгрейдов")
    contracts_global = models.FloatField(
        default=1.0, verbose_name="Коэф. контрактов")
    battles_global = models.FloatField(
        default=1.0, verbose_name="Коэф. баттлов")

    def save(self, *args, **kwargs):
        self.pk = 1  # всегда одна запись с id=1
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        # запрещаем удаление
        pass

    @classmethod
    def get_instance(cls):
        obj, created = cls.objects.get_or_create(pk=1)
        return obj

    class Meta:
        verbose_name = "Глобальные коэффициенты"
        verbose_name_plural = "Глобальные коэффициенты"

    def __str__(self):
        return f"Коэф: raffles={self.raffles_global}, cases={self.cases_global}, upgrades={self.upgrades_global}"
