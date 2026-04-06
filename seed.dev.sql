insert into
  "settings" ("campaign_state", "bot_template_start", "bot_template_jackpot")
values
  (
    'LIVE',
    E'<Тут должен быть какой-то текст о начале игры>',
    E'<Тут должен быть какой-то текст о том что ты выиграл промокод "{{code}}">'
  );

insert into
  "gifts" ("name", "target", "url", "image_url", "legal_text_variant")
values
  ('256 Гб на 1 месяц', 100, '#', '/gifts/1.webp', 'SHORT'),
  ('512 Гб на 1 месяц', 500, '#', '/gifts/2.webp', 'SHORT'),
  ('1 Тб на 3 месяца', 1000, '#', '/gifts/3.webp', 'LONG');

insert into
  "jackpots" ("name", "image_url")
values
  ('1 Тб на 1 год', '/gifts/jackpot.webp');

insert into
  "promocodes" ("code")
values
  ('Тестовый промокод 1'),
  ('Тестовый промокод 2'),
  ('Тестовый промокод 3');

insert into
  "boosters" ("id", "name", "type", "duration", "value")
overriding system value
values
  (1, 'Скорость x2', 'CLICK_MULTIPLIER', '30s', 1);

insert into
  "milestones" ("target", "booster_id")
values
  (50, 1),
  (200, 1),
  (400, 1),
  (600, 1),
  (750, 1),
  (900, 1);
