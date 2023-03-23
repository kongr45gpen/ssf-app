## Usage

ssf-app is built on top of [React](https://reactjs.org/), so you will need to get some Javascript running on your computer to execute it.

First, make sure you have Node.js 18 installed (older versions might work, but not tested).
[nvm](https://github.com/nvm-sh/nvm) is a popular choice for that.  
Then, you will need to install a few dependencies, and start the project:
```bash
# Use Node.js version 18
nvm use 18

# Download the current version of ssf-app
git clone https://github.com/kongr45gpen/ssf-app.git
cd ssf-app

# Install dependencies
npm install

# Start ssf-app development server at port :3000
npm start
```

## Deployment
1. Deploy the main app as static HTML files
2. Deploy the strapi app on a TCP port
3. Set up your web server. Example for Apache2:

```apache
<VirtualHost *:80>
    ServerName ssf-app.example.com

DocumentRoot /var/www/ssf-app/build

<Location /uploads>
    Require all granted
    ProxyPass http://127.0.0.1:1337/uploads
    ProxyPassReverse http://127.0.0.1:1337/uploads
</Location>

    <Location /api>
        Require all granted
        ProxyPass http://127.0.0.1:1337/api
        ProxyPassReverse http://127.0.0.1:1337/api
    </Location>

<Directory /var/www/ssf-app/build>
    RewriteEngine On
    # Don't rewrite files or directories
    RewriteCond %{REQUEST_FILENAME} -f [OR]
    RewriteCond %{REQUEST_FILENAME} -d
    RewriteRule ^ - [L]
    # Rewrite everything else to index.html to allow html5 state links
    RewriteRule ^ index.html [L]
</Directory>

</VirtualHost>
```