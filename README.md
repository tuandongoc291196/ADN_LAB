# ADN_LAB
project-root/
├── package.json          # File package.json ở thư mục gốc với script để chạy cả client và server
├── client/               # Thư mục chứa code React
│   ├── package.json      # File package.json của client với proxy và "start" script
│   ├── public/
│   └── src/
└── server/               # Thư mục chứa code Node.js
    ├── package.json      # File package.json của server với "start" và "dev" script
    ├── server.js
    ├── .env
    └── ...