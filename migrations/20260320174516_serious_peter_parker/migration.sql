CREATE TYPE "campaign_state" AS ENUM('LIVE', 'OVER');
CREATE TABLE "settigns" (
	"campaign_state" "campaign_state" NOT NULL
);
