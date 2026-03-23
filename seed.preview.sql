insert into
  "settings" ("campaign_state")
values
  ('LIVE');

insert into
  "gifts" ("name", "target", "url", "image_url")
values
  ('256 ГБ на 1 месяц', 1000, '#', '/gifts/1.webp'),
  ('512 ГБ на 1 месяц', 5000, '#', '/gifts/2.webp'),
  ('1 ТБ на 3 месяца', 10000, '#', '/gifts/3.webp');

insert into
  "jackpots" ("name", "image_url")
values
  ('1 ГБ на 1 год', '/gifts/jackpot.webp');

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
  (1, 'Скорость x2', 'CLICK_MULTIPLIER', '30s', 1);

insert into
  "milestones" ("target", "booster_id")
values
values
  (600, 1),
  (1500, 1),
  (3000, 1),
  (4000, 1),
  (6000, 1),
  (7000, 1),
  (7500, 1)
  (8000, 1),
  (9000, 1),
  (9500, 1);