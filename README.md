# avro-schemas

A repository to maintain AVRO schema's for use in the test-bed.

## Introduction

The test-bed is a message-based system, i.e. its functionality is based on exchanging messages between systems. Therefore, messages become a kind of *contract* between information producers and consumers. This is different from an API (Application Programmer Interface) based system such as REST, where the API is the contract.

Since messages are so important, the test-bed requires you to define an AVRO-based schema for each message that you want to send. These schema's will be stored in the test-bed's schema registry. As multiple producers may use the same topic, each message is a so-called KeyedMessage, where the *key* is set to the producer's ID, and the *value* is the actual message. In this way, we can easily filter messages based on producer's ID.

## Registering a new message (schema)

In order to register a new message, therefore, we need two schema's, one for the key and one for the value. By convention, these schema's are named `TOPIC_NAME-key` and `TOPIC_NAME-value`, and need to be registered before actually sending messages with them. Fortunately, it is no problem to register them multiple times: in case the schema is already present, it will simply be ignored.

To register a new schema pair, you have several possibilities:
- Use the [schema registry-ui](http://localhost:3601/) by registering both schema's manually. The subject is `TOPIC_NAME-key` and `TOPIC_NAME-value`, respectively. Please note that I've experienced schema rejections using the UI, which were accepted by the schema registry.
- Use the [postj](npmjs.com/postj) utility.
- Use your adapter, which may contain functionality for it too.

## Known schema's

In this repository, we store the known schema's, divided in two main folders:
- `core`: Contains the core schema's for use in the test-bed, e.g. for logging, configuration and heartbeat. These should always be registered in the schema registry.
- `other`: Contains schema's that may be useful during a trial, depending on the systems that are connected.

Each folder is subdivided into folders per topic. The `core` topics are preceded by an underscore by convention, as to indicate that we are dealing with system topics.
