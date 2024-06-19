@echo off
git fetch upstream
git checkout main
git merge upstream/main
echo "Once done, push the changes to your forked repository."
pause
git push -f origin main