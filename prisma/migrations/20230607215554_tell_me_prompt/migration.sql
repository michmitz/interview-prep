-- AlterTable
ALTER TABLE "Note" ADD COLUMN     "noteHash" TEXT,
ADD COLUMN     "subject" TEXT;

-- CreateTable
CREATE TABLE "TellMePrompt" (
    "id" TEXT NOT NULL,
    "promptAnswer" TEXT NOT NULL,
    "promptAnswerHash" TEXT,
    "authorId" TEXT,

    CONSTRAINT "TellMePrompt_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TellMePrompt_authorId_key" ON "TellMePrompt"("authorId");

-- AddForeignKey
ALTER TABLE "TellMePrompt" ADD CONSTRAINT "TellMePrompt_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
