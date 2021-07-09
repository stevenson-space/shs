# [stevenson.space](https://stevenson.space)
Beautiful and practical agenda management tool for SHS students

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Setting up your .env file
Duplicate the `.env-template` and rename the duplicate to `.env`. This will keep the template, and give you a personal development environment that won't get commited to github.

### Developing/Modifying a theme
When developing a new theme, set the .env file like so: `VUE_APP_EDIT_COLORS=true`. Doing this will automatically load the **last** theme in the `themeIdeas.json` into the app. When you save the file, it will automatically apply last the theme to the app which speeds up development time greatly. When the theme is ready for production, move it to to the `themes.json`. Also note, that in development, the theme will not show up in the `/colors` page.
## Contributing
Interested in contributing? Check out the [documentation](DOCS.md) (WIP)
