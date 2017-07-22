# HomeAutomation

This repo was originally forked from [jingsta/AlexaOnNodeJS-Lambda](HTTPS://github.com/jingsta/AlexaOnNodeJS-Lambda). I don't have a tivo nor do I use couchpotato and I just wanted to (at the start) control my Sony Bravia TV with my Amazon Echo Dot. Anything unrelated to the TV commands has been stripped out, and the TV commands themselves have been updated to use the `bravia` npm package rather than the custom requests @jingsta used in his repo. Also, as you should have noticed, I have renamed this repo to `HomeAutomation` to be (along with other object, files and directories) more descriptive of the project's purpose. In the future, this repo will also contain code to control RF controlled power outlets and WiFi thermostats.

## Prerequisites
In order to control your Sony Bravia TV (along with anything else you want to hack on to this project) you'll need the following:

* Sony Bravia Android powered smart TV
   * Duh. 
* Admin access to your router
   * You'll need to punch a hole in your firewall and forward it to your node server
* Static IP for your Sony Bravia TV
   * You should be able to configure this with a DHCP reservation through your router or DHCP server. You can also configure your TV to use a static IP.
   * I use both a static IP for my TV and I run an internal DNS server that has an entry for my TV
* Amazon AWS account -- to run lambda code on
   * The free account should be enough for most people
* Amazon Developer account -- to make an Alexa app
   * You do not have to publish your app to use it on your Echo Dot
* A server -- to run `my_node_server` on
   * This should have a static IP so your router can forward requests to it
   * `my_node_server`, in its current configuration, will require:
      * Node and NPM
         * at the time of writing this server is running on node v6.11.1 (stable)
      * Dynamic DNS/static IP
         * I personally use Cloudflare's free plan and their API to update my DNS entries. Duckdns.org could also be used, along with any other dynamic DNS provider. 
         * If you have a static ip or a domain pointing a static IP for your node server you can use that instead.
      * SSL cert
         * With letsencrypt there should really be no reason you are not using HTTPS for anything you expose to the Internet
         * If you switch to HTTP (not recommended) requests in the lambda code you can ignore this, but I cannot emphasize how much I **DO  NOT** recommend this.
      * Reverse proxy supporting HTTPS
         * This is necessary to support HTTPS requests to the node server. 
         * I prefer NGINX for this
         * If you switch to HTTP (not recommended) requests in the lambda code you can ignore this, but I cannot emphasize how much I **DO  NOT** recommend this.
   * I recommend this server be self-hosted
      * A raspberry pi has more than enough power to run the node server
      * You could theoretically use a remote server and punch holes in your firewall to allow it to connect to your Sony Bravia TV but AFAIK the sony bravia API does not support HTTPS and the only protection really offered is the PSK. I personally would not expose such a weakly protected API to the Internet, because it's the internet. Not to say this node server is extremely hardened, but at least with HTTPS we're less exposed. (Btw, I fully expect someone to disagree with me. Please do. Tell me what I'm doing wrong and what steps I should take to correct it.)
* (optional) Docker
   * Obviously this is optional, but I would recommend it.
   * You can run this straight up as a docker container and configure NGINX/whatever to connect to the docker app's port or expose the port directly to the internet (not recommended)
   * I personally use [@jwilder's NGINX-proxy](HTTPS://github.com/jwilder/NGINX-proxy) docker container behind another NGINX proxy. This allows me to use a single server for all of my dockerized apps, normal web apps and utilize NGINX as a reverse proxy to any other servers I might be hosting internally.

## Getting Started

1. clone this repo
   * `git clone HTTPS://github.com/shellfyred/HomeAutomation.git`
2. install package depencies for node server
   * `cd HomeAutomation/my_node_server && npm install`
3. Copy config.js.sample to config.js
   * `cp my_node_server/app/config.js.sample my_node_server/app/config.js`
   * `cp lambda_code/config.js.sample lambda_code/config.js`
4. Configure my_node_server
   * `vi my_node_server/app/config.js`
      * update `host` with the server hosting `my_node_server`'s IP address or DNS name
      * update `port` with the port you want `my_node_Server` to be listening on
        * This will need to match the port your reverse proxy or router is expecting, depending on how you're exposing `my_node_server` to the internet
      * update `apiKey` with a random string to help protect-ish your `my_node_server` app. I use a base64 encoded string
      * update `sony.ip` with your Sony Bravia TV's IP address or hostname
      * update `sony.port` with your Sony Bravia TV's API server port. It should be `80 unless you've found a way to change that. In which case, please tell me!
      * update `sony.psk` with the Pre-Shared Key you set up on your Sony Bravia TV. For instructions on how to that see the [bravia npm package's documentation](https://www.npmjs.com/package/bravia)
5. Start creating your alexa app
    * we basically just need to get the application id at this point
6. Configure lambda_code
   * `vi lambda_code/config.js`
     * update `appId` with your newly created Alexa App's ID (should be listed under `Skill Information`)
     * update `host` with the static IP or DNS entry pointing to your server
     * update `port` with the port your node server, docker app or reverse proxy is listening on
     * update `apiKey` with the same value you specified in for `apiKey` in `my_node_server`'s config
7. zip up the contents of `lambda_code`
8. create AWS lambda function and upload `lambda_code.zip` for its source
9. Continue creating your Alexa app:
   * copy and paste contents of `lambda_code\SpeechAssets\SampleUtterances.txt` to `Sample Utterances` under the `Interaction Model`
   * copy and paste contents of `lambda_code\SpeechAssets\IntentSchema.json` to `Intent Schema` under the `Interaction Model`
   * Specify your AWS Lambda endpoint, region and function id under `configuration`
10. Enabled testing on your Alexa app under the `Test` tab
11. Add your Alexa Skill to your Alexa app
12. Start the `my_node_server` node server if you haven't already
13. Say `Alexa tell {Alexa app invocation name} turn {off|on} the TV