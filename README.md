# Дорога домой 3D — полный проект (web + Java backend + Android)

```
web/       игра (three.js), PWA: ставится на телефон и работает офлайн
backend/   Spring Boot 3 · Java 21 · JPA/H2: облачное сохранение и рейтинг
mobile/    обёртка Capacitor для Android (APK/AAB)
.github/   CI: сборка и тесты backend
```
## Запуск (backend + игра вместе)
    cd backend && mvn spring-boot:run        # нужен JDK 21 и Maven
    открыть http://localhost:8080
Только игра без сервера: `cd web && python3 -m http.server 8000` (облако и рейтинг будут недоступны, остальное работает).
Тесты: `mvn -f backend/pom.xml verify`.

## API
| Метод | Путь | Описание |
|---|---|---|
| GET | `/api/progress/{id}` | загрузить сохранение (id — UUID устройства) |
| PUT | `/api/progress/{id}` | сохранить: name, money, earned, rides, clean, fines, data |
| GET | `/api/leaderboard` | топ-20 по заработанным деньгам |
Входные данные проверяются (формат id, длина, неотрицательные числа). Данные хранятся в H2-файле `backend/data/`.

## Телефон
- **PWA:** откройте сайт на телефоне → «Добавить на главный экран».
- **Android-приложение:** в `web/config.js` укажите полный адрес сервера (`https://ваш-домен/api`), затем
      cd mobile && npm install && npx cap add android && npx cap sync && npx cap open android
  и соберите APK в Android Studio. Нужны Node.js и Android Studio.

## Ограничения (честно)
- Код backend и Android-сборка не запускались в среде, где создавался проект: при первой сборке возможны мелкие правки.
- Рейтинг доверяет данным клиента (нет защиты от накрутки), аккаунтов и паролей нет — только анонимный UUID устройства. Для продакшена: авторизация (Spring Security + JWT), серверная проверка поездок, PostgreSQL вместо H2, ограничение CORS (`pdd.cors`), HTTPS, лимиты запросов.
- Реалистичные 3D-модели нужно скачать вручную (см. `web/data/models.js` и `web/assets/models/`).
