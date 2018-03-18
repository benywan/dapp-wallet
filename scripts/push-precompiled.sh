#!/bin/bash
set -e

if [ "$TRAVIS_PULL_REQUEST" != "false" -o "$TRAVIS_BRANCH" != "master" ]; then
  echo "Not on master branch, skipping precompiled update"
  exit 0
fi

# variables
PVER="1-10"
PTYPE="wallet"
UTCDATE=`date -u "+%Y%m%d-%H%M%S"`
PRE_REPO="js-dist-paritytech/parity-${TRAVIS_BRANCH}-${PVER}-${PTYPE}.git"
PRE_REPO_TOKEN="https://${GH_TOKEN}:@github.com/${PRE_REPO}"
BASEDIR=`dirname $0`

pushd $BASEDIR/..

echo "*** [$PRE_REPO] Cloning repo"
rm -rf precompiled
git clone https://github.com/$PRE_REPO precompiled
cd precompiled
git config push.default simple
git config merge.ours.driver true
git config user.email "$GITHUB_EMAIL"
git config user.name "GitLab Build Bot"
git remote set-url origin $PRE_REPO_TOKEN > /dev/null 2>&1

echo "*** [$PRE_REPO] Copying build"
rm -rf build
cp -rf ../.dist/build .
find . -name "*.css.map" -type f -delete
find . -name "*.js.map" -type f -delete
find . -name "package.json" -type f -delete

echo "*** [$PRE_REPO] Adding to git"
echo "$UTCDATE" >README.md
git add --all .
git commit -m "$UTCDATE"

echo "*** [$PRE_REPO] Pushing upstream"
git push --quiet origin HEAD:refs/heads/master > /dev/null 2>&1

cd ..
rm -rf .dist .build .happypack precompiled
popd

# exit with exit code
exit 0
