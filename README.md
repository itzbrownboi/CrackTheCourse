# CracktheCourse 

App connnecting students with university tutors


The `node_modules` directory is excluded from version control using `.gitignore`.


## Starting

### 1. Clone the Repository

```
git clone https://github.com/itzbrownboi/CrackTheCourse.git
cd crack-the-course-app
```

### 2. Install Dependencies

Make sure you have **Node.js** installed. Then install MongoDB and Express:

```
npm init -y
npm install mongodb
npm install express
```


## Connecting MongoDB

1. Make sure you have connected to MongoDB Atlas and have URI 

## Running the Server

To start the server locally:

```
node server.js
```

Then, go to [http://localhost:3000](http://localhost:3000) in your browser to view the app.


## Frontend Structure

Place your static files in the following locations:

- **HTML files**: in `public/`
- **CSS files**: in `public/css/`
- **Images**: in `public/images/`
- **JavaScript (client-side)**: in `public/js/`

The app uses `express.static()` to serve everything from the `public` folder, so all files inside are accessible via the browser.


## Adding a New Feature or Page

To create a new page or feature:

1. **Create an HTML file** in `public/`, e.g. `dashboard.html`
2. **Create a matching CSS file** in `public/css/`, e.g. `dashboard.css`
3. **(Optional) Create a JS file** in `public/js/`, e.g. `dashboard.js`
4. **Link your CSS and JS in the HTML**:


## API Endpoints

You can define endpoints in `server.js` to handle actions like login, signup, etc. 

These endpoints can then be called from your frontend JS using `fetch()`.