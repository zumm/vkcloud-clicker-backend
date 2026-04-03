insert into
  "settings" ("campaign_state", "bot_template_start", "bot_template_jackpot")
values
  (
    'LIVE',
    E'Жми «Играть» ⚡️\nИ погнали увеличивать память ☁️',
    E'Ты забрал максимум 💥\n1 ТБ на год уже твой\n\nЗабери промокод и подключай ⚡️'
  );

insert into
  "gifts" ("name", "target", "url", "image_url")
values
  ('256 ГБ на 1 месяц', 250, '#', '/gifts/1.webp'),
  ('512 ГБ на 1 месяц', 1050, '#', '/gifts/2.webp'),
  ('1 ТБ на 3 месяца', 2250, '#', '/gifts/3.webp');

insert into
  "jackpots" ("name", "image_url")
values
  ('1 ТБ на 1 год', '/gifts/jackpot.webp');

insert into
  "promocodes" ("code")
values
  ('PROMOCODE1'),
  ('PROMOCODE2'),
  ('PROMOCODE3');

insert into
  "boosters" ("id", "name", "type", "duration", "value")
overriding system value
values
  (1, 'Скорость x2', 'CLICK_MULTIPLIER', '20s', 1);

insert into
  "milestones" ("target", "booster_id")
values
  (75, 1),
  (350, 1),
  (700, 1),
  (1200, 1),
  (1500, 1),
  (1900, 1);