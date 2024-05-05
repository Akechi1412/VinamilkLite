<a name="readme-top"></a>

<!-- ABOUT THE PROJECT -->

## About The Project

This is a project to design and build the basic interface and basic features for the website of Vinamilk company.

The designs and resources of this project are based on the official Vinamilk website: [ https://new.vinamilk.com.vn/](https://new.vinamilk.com.vn/).

This project was carried out as an assignment for the Web Programming course and does not aim for any commercial purposes.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

- [![PHP][PHP]][PHP-url]
- [![MYSQL][mysql]][mysql-url]
- [![React][React.js]][React-url]
- [![Tailwind CSS][Tailwind.css]][Tailwind-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

To start the project, you need to install the necessary software and follow the steps below.

### Prerequisites

- Apache webserver and MYSQL (recommended XAMPP).
  > PHP version >= 8.0
- Composer
- NodeJS (version >= 18)

### Installation

1. Clone the repo

   You should clone the repo into a directory that can be accessed from the Apache webserver.

   If you are using XAMPP, clone it into the htdocs directory or the directory corresponding to DocumentRoot.

```sh
   git clone https://github.com/Akechi1412/VinamilkLite.git
```

2. Install Composer packages

```sh
   cd api
   composer install
```

3. Import SQL

   Import file vinamilk_lite from directory `api/sql`.

4. Configure API environment variables

   Create a `.env` file in the `api` directory to configure the connection to MySQL and set up the mailer based on the `.env.example` file.

5. Start API server

   Move the `api` directory to a path accessible from the Apache server.
   Start Apache server and MySQL server and access the corresponding url to ensure the API server is working.

6. Install NPM packages

```sh
   cd ../client
   npm install
```

7. Configure client environment variables

   Create a `.env.local` file in the client directory to configure api base url.

```sh
   VNM_API_BASE=[YOUR_API_BASE_URL]
```

8. Start React App

```sh
   npm run dev
```

9. Getting started

Login with subscriber/member:

- email: cuongle2001@gmail.com
- password: User123@

Login with admin:

- email: admin123@gmail.com
- password: Admin123#

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTRIBUTING -->

## Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[PHP]: https://www.php.net/images/logos/php-power-micro.png
[PHP-url]: https://www.php.net/
[mysql]: https://img.shields.io/badge/mysql-4479A1?style=flat&logo=mysql&logoColor=white
[mysql-url]: https://www.mysql.com/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Tailwind.css]: https://img.shields.io/badge/tailwindcss-0F172A?&logo=tailwindcss
[Tailwind-url]: https://tailwindcss.com/
