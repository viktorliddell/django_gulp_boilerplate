# Django + Gulp Boilerplate

This is a Django + Gulp Boilerplate for easy start with Django Framework and advanced frontend tools.

![alt text](https://github.com/viktorliddell/django_gulp_boilerplate/blob/master/thumb.png "Logo")

## Getting started

Structure:

- `assets` - folder for your frontend: fonts, images, js, libs, sass
- `core` - main Django app folder
- `static` - Gulp collects all static files from `assets` here. Don't put any static files by yourself.
- `templates` - just your HTML templates

Installation:

1. Create virtual enviroment for your project: `python -m venv ./venv`
2. Activate it with: `source ./venv/Scripts/activate` for Windows
3. Download the latest version of Django from requirements.txt: `pip install -r requirements.txt`
4. If I'll see a warning: "You are using pip version..."
Don't worry, just type: `python -m pip install --upgrade pip` and everything will be just fine.
5. Now you can check Django with command: `python manage.py runserver`
6. Open new terminal and let's install all dependencies for our frontend:
`npm install --save-dev gulp-babel@next @babel/core @babel/preset-env browser-sync del gulp gulp-autoprefixer gulp-babel gulp-cheerio gulp-concat gulp-csso gulp-imagemin gulp-load-plugins gulp-plumber gulp-rename gulp-replace gulp-sass gulp-sourcemaps gulp-svg-sprite gulp-svgmin gulp-uglify imagemin-jpeg-recompress imagemin-pngquant`
7. Almost done! Now we can start django on backend with: `python manage.py runserver` and start the frontend in new terminal with: `npm start`
8. That's it! Happy hacking!
