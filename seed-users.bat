@echo off
echo Running Santos Event System database seeder...
node prisma/seed-data.js
echo.
echo Seeding complete! Press any key to exit.
pause > nul 