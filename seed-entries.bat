@echo off
echo Seeding test entries...
npx ts-node prisma/seed-entries.ts
pause 