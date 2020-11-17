# youtube-data-scraper

![youtube-data-scraper system diagram](/images/youtube-data-scraper.png)

Serverless/Typescript project. REST API to scrape metadata from all youtube videos uploaded to a channel(s), store them in a SQL database, and get/query/delete. Deployed to AWS using serverless and github actions. Lambda used for API/functions SQS for buffering/distribution, APIGateway for the API and RDS Aurora for persistence

 ## Installation

Checkout repo

    npm install 

To deploy, you'll need some AWS credentials and a google API token. You can create a `.env` file that looks like: 

`GOOGLE_API_KEY=xxxxxxxxx`
`RDS_PASSWORD=xxxxx`
`RDS_USERNAME=xxxxx`

You can choose the username and password for the RDS database. I've stored mine in github secrets (see `github/workflows/main.yml`)

Currently this project cannot be run locally, it was easier and faster to develop against the real cloud environment. Next steps would be to add `serverless-offline` /`localstack`/`mountebank` and a local SQL solution to enable offline development.

## Usage

The base API URL is subject to change any time a deployment happens, since API gateway randomly assigns it every time, unless you pay for a custom domain name, which I've not done for this project. Contact mishabruml@gmail.com for a working API URL.

  **GET** /scrape - https://43dsxyxd92.execute-api.eu-west-1.amazonaws.com/dev/scrape
Initiates the scrape. Use a query parameter `channel` to specify a channel. You can specify more than one at a time. For example, to scrape youtube videos from `GlobalCyclingNetwork` and `globalmtb` in a single call, make a GET request to https://43dsxyxd92.execute-api.eu-west-1.amazonaws.com/dev/scrape?channel=GlobalCyclingNetwork&channel=globalmtb

  **GET** /videos - https://43dsxyxd92.execute-api.eu-west-1.amazonaws.com/dev/videos
  Gets all videos
  
  **GET** /video{id}- https://43dsxyxd92.execute-api.eu-west-1.amazonaws.com/dev/video/{id}
  Get a video by id e.g. https://43dsxyxd92.execute-api.eu-west-1.amazonaws.com/dev/video/12345
  
  **DELETE** /video{id}- https://43dsxyxd92.execute-api.eu-west-1.amazonaws.com/dev/video/{id}
Make a DELETE HTTP request to this endpoint to delete a video by id e.g. https://43dsxyxd92.execute-api.eu-west-1.amazonaws.com/dev/video/12345

  **GET** /videos/search?q=foo- https://43dsxyxd92.execute-api.eu-west-1.amazonaws.com/dev/videos/search
Search for video(s) with the query parameter q, for example
https://43dsxyxd92.execute-api.eu-west-1.amazonaws.com/dev/videos/search?q=bike 
or
https://43dsxyxd92.execute-api.eu-west-1.amazonaws.com/dev/videos/search?q=Yoann%20Barelli

## Tests
To run the suite;

    npm test
    
I have provided some basic unit tests, not on all functions and files. These are to give you an idea of what I can do, and show that I am always thinking of testing, but it would of course be my preference and intention to continue in the same vein, giving deep coverage of the service, but I was spending quite a lot of time on this already! 

## Design/how it works

The system is designed around serverless and AWS and so has the usual resilience/scalability/availability that you'd expect from these platforms and patterns. A request to the scrape playlist ids endpoint will obtain upload playlist ids for a given array of youtube channel search strings, using youtubes search api. These playlist ids are sent to an SQS queue where they are consumed by another lambda, scrape-videos, where another youtube API (list playlist items) is performed to grab videos from that upload playlist. This API will only give 50 results max per call, and given there are 1000s of videos on the GCN/GlobalMTB channels, it was necessary to paginate the results; this was done by sending the playlistId and pageToken back to the queue which gave a fast and horizontally scalable way to traverse the results pages.

The scrape-videos lambda also sent processed API results (the video data we want e.g. title and publishedAt date) to a separate store-video queue, where another lambda would process the entries into the SQL database.

Storage and CRUD operations was managed by sequelize, a node SQL ORM and some simple lambda wrappers and API mappings.

I should note at this point that the youtube.sql file was uploaded manually to the database via the command `mysql -hxxx-host-xxx -uxxx -pxxx < youtube.sql` ahead of using the database in service. I would have automated this process but it's quite tricky within AWS/Serverless since cloudformation doesn't support running SQL as part of standing up a DB resource. It is possible with lambda custom resources e.g. https://github.com/davinod/rds-lambda but its quite a pain and a lot of work, and probably not what you wanted to see from this project.

