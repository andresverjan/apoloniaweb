# Apolonia! :) Software Administrativo para Consultorios Odontologicos.

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.3.5.

Steps: 
1. npm install -g @angular/cli
2. yarn install
3. ng serve

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).


## How to Run Docker
1. Remove Docker if exist: 
   docker rm apoloniaweb
2. Build Image:
   docker build -t apolonia/webapp:1.0 .
3. Run Container:
   docker run -it --name apoloniaweb -h apoloniaweb.com -p 4200:4200 -p 23:22 apolonia/webapp:1.0
4. Open browser URL:
   http://localhost:4200/
   