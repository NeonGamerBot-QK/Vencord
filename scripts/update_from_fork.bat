@echo off
git fetch upstream
git checkout main
git rebase upstream/main
echo "Once done, push the changes to your forked repository."
pause
git push -f origin main