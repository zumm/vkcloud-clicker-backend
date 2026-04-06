CREATE TYPE "legal_text_variant" AS ENUM('SHORT', 'LONG');
ALTER TABLE "gifts" ADD COLUMN "legal_text_variant" "legal_text_variant" DEFAULT 'SHORT'::"legal_text_variant" NOT NULL;