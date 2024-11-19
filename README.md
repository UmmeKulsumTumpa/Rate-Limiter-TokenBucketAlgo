# Token Bucket Rate Limiter

## Overview

Welcome to the Token Bucket Rate Limiter project! This application demonstrates the implementation of a rate limiting mechanism using the Token Bucket algorithm within a middleware layer. Developed with JavaScript, Express, Redis, and React, this project serves as a robust example of how to control the flow of requests from clients to a backend service, ensuring a smooth and efficient user experience.

## Features

- **Layered Architecture**: Separate frontend, middleware, and backend components for a clean and maintainable design.
- **Token Bucket Algorithm**: Efficiently limits requests using the Token Bucket strategy, ideal for managing API traffic.
- **Response Headers Management**: Sends appropriate headers in response scenarios, including:
  - `X-Ratelimit-Remaining`: Shows the remaining tokens available.
  - `X-Ratelimit-Limit`: Displays the maximum number of tokens allowed.
  - `X-Ratelimit-Retry-After`: Informs clients when they can retry after being rate-limited.
- **Lua Script and Redis Integration**: Implements core rate limiting logic with custom Lua scripts or sorted sets in Redis, ensuring high performance and responsiveness.
- **Mock Scenarios**: Demonstrates the utility of rate limiting and effectively handles race conditions using various tools.

## Technology Stack

- **Frontend**: React
- **Middleware**: Express.js
- **Database**: Redis (In-Memory)
- **Scripting**: Lua
- **Version Control**: Git

## Getting Started

To get started with the project, follow these steps:

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/UmmeKulsumTumpa/Rate-Limiter-TokenBucketAlgo.git
   ```

## Usage

- Access the frontend at `http://localhost:5173`.
- Continuously test the rate-limited endpoint through the React interface.
- Observe the behavior and response headers as you hit the API rapidly.

## Demonstration

Explore how the rate limiting effectively controls traffic, preventing overload and ensuring fair usage among clients. Tools are provided to simulate various scenarios and demonstrate handling of race conditions.

## Contributing

We welcome contributions! If you have suggestions for improvements or new features, please fork the repository and submit a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Special thanks to the contributors and numerous resources that helped shape this project.

---
