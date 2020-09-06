heroku create

heroku create -b https://github.com/mars/create-react-app-buildpack.git


heroku addons:create heroku-postgresql:hobby-dev

heroku pg:credentials:url

heroku pg:psql --command="\dt"


heroku logs --tails
