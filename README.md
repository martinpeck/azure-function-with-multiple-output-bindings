# Azure Functions with Multiple Outputs

> Note: This project was written while investigating the behaviour of multiple outputs. It's not really a good example of anything, so please don't base your own code on the code found here.

The is an Azure function app containing 4 functions. Each is written using Javascript, and have been tested using the Functions runtime version 2.

I wanted to see the order in which output bindings are fired. To try and determine this, I have 4 functions, each with two output bindings: 

- one to a storage queue
- one to blob storage

I wanted to determine whether the order in which the function code calls the bindings was important, or whether it was the order in which the bindings are declared in `function.json` that's important. To do this, I've created 4 functions that:

- try each order of code execution
- try each order of binding definition

## Method

It's difficult to see from logs which order the bindings fire, so in order to determine the order I **deliberately** break the blob storage binding by giving it a bad/invalid connection string. I then look at when this error is logged, and whether items are added to the queue or not.

If, for example, blog storage were to ALWAYs fire before the queue binding, I would never expect to see items in the queue as I'd expect the exception to cause the function/runtime to stop processing and return an error. 

I then have 4 functions:

## 1: blob-queue-blobbinding-queuebinding 
- executes the blob binding, in code, before the queue binding
- has the blob binding definition (in function.json) before the queue binding definition

## 2: blob-queue-queuebinding-blobbinding
- executes the blob binding, in code, before the queue binding
- has the queue binding definition (in function.json) before the blob binding definition

## 3: queue-blob-blobbinding-queuebinding
- executes the queue binding, in code, before the blob binding
- has the blob binding definition (in function.json) before the queue binding definition

## 4: queue-blob-queuebinding-blobbinding
- executes the queue binding, in code, before the blob binding
- has the queue binding definition (in function.json) before the blob binding definition

## Running Locally

1. Clone the function app code
2. Using the Azure portal, create a storage account
    - within that storage account, create a queue called `outputqueue`
3. Set up your `local.settings.json` something like this...

```
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "",
    "QueueStorageConnectionString": "[ADD CONNECTION STRING TO YOUR STORAGE ACCOUNT HERE]",
    "ThisConnectionStringIsBroken": "broken"
  }
}
```
 ## Deploying to Azure

 When you deploy this to azure, remember to set up 2 Application Settings `QueueStorageConnectionString` and `ThisConnectionStringIsBroken` with the same values as those in your `local.settings.json`.

# Results

## Running locally (runtime 2)

Using the following tooling...

- Azure Functions Core Tools (2.0.1-beta.21)
- Function Runtime Version: 2.0.11370.0

...I see the following results:

* In all cases, the function outputs the START and END logging
* In all cases, the function returns an HTTP 500 response
* In all cases, a message was added to the queue

This suggests:
1. neither the code order OR the binding order in being respected
2. all bindings are being run AFTER `context.done()`
3. all binding are run, regardless of any one binding failing.

## Running in Azure (Runtime 1)

At the time of testing, this uses...

- Runtime version: 1.0.11388.0 (~1)

... and the results are:

* In all cases, the function outputs the START and END logging
* In all cases, the function returns an HTTP 500 response
* Only the following messages are seen in the queue:
  * { "message": "blob-queue-queuebinding-blobbinding" }
  * { "message": "queue-blob-queuebinding-blobbinding" }

This suggests:
1. code order is not important
2. binding order IS important, as we only see messages when the queue binding is first
3. all bindings are being run AFTER `context.done()`

## Running in Azure (runtime 2)

At the time of testing, this uses...

- Runtime version: 2.0.11390.0 (beta)

... and the results are:

* In all cases, the function outputs the START and END logging
* In all cases, the function returns an HTTP 500 response
* In all cases, a message was added to the queue

This suggests:
1. neither the code order OR the binding order in being respected
2. all bindings are being run AFTER `context.done()`
3. all binding are run, regardless of any one binding failing

# Conclusions

1. Runtime 1 and 2 execute bindings differently. Runtime 1 respects the order of 'function.json' where as Runtime 2 appears to run all bindings, regardless of errors
2. Anecdotally it's understood that "blob bindings run before other bindings" but for neither of these runtimes do I see this being upheld.


